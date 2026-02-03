import pandas as pd
import json
import numpy as np
from typing import Set, List

def load_skills(skills_json: str) -> Set[str]:
    if pd.isna(skills_json) or not skills_json:
        return set()
    try:
        skills = json.loads(skills_json)
        return set(s.lower() for s in skills)
    except:
        return set()

# Hàm chấm điểm theo độ match kĩ năng
def compute_skill_match_score(job_skills: Set[str], cv_skills: Set[str]) -> float:
    if not job_skills:
        return 50.0  
    
    if not cv_skills:
        return 0.0
    
    intersection = job_skills & cv_skills
    union = job_skills | cv_skills
    
    # Thuật toán Jaccard similarity (CV và JD giống nhau bao nhiêu %)
    jaccard = len(intersection) / len(union) if union else 0
    
    # Thuật toán Coverage (CV đáp ứng được bao nhiêu yêu cầu của JD)
    coverage = len(intersection) / len(job_skills) if job_skills else 0
    
    # Weighted score: 60% coverage + 40% jaccard
    score = (coverage * 0.6 + jaccard * 0.4) * 100
    
    return min(100.0, score)

def compute_experience_score(job_exp: int, cv_exp: int) -> float:
    if pd.isna(job_exp):
        return 50.0  
    
    if pd.isna(cv_exp):
        return 20.0  
    
    diff = abs(job_exp - cv_exp)
    
    if diff == 0:
        return 100.0
    elif diff == 1:
        return 80.0
    elif diff <= 2:
        return 60.0
    elif diff <= 3:
        return 40.0
    else:
        # Dùng Proportional decay để hạ điểm tốt hơn
        return max(0.0, 40.0 - (diff - 3) * 10)

def compute_education_score(job_edu: str, cv_edu: str) -> float:
    if pd.isna(job_edu):
        return 50.0 
    
    if pd.isna(cv_edu):
        return 30.0  
    
    edu_levels = {
        'high school': 0,
        'undergraduate': 1,
        'bachelor': 2,
        'master': 3,
        'phd': 4
    }
    
    job_level = edu_levels.get(job_edu.lower(), 0)
    cv_level = edu_levels.get(cv_edu.lower(), 0)
    
    if cv_level >= job_level:
        return 100.0
    elif cv_level == job_level - 1:
        return 60.0
    else:
        return 30.0

def compute_seniority_score(job_seniority: str, cv_exp: int) -> float:
    if pd.isna(job_seniority):
        return 50.0
    
    if pd.isna(cv_exp):
        return 30.0

    seniority_exp = {
        'intern': (0, 0),
        'junior': (0, 2),
        'mid': (2, 5),
        'senior': (5, 10),
        'manager': (8, 15),
        'executive': (12, 50)
    }
    
    min_exp, max_exp = seniority_exp.get(job_seniority.lower(), (0, 50))
    
    if min_exp <= cv_exp <= max_exp:
        return 100.0
    elif cv_exp < min_exp:
        gap = min_exp - cv_exp
        return max(20.0, 100.0 - gap * 20)
    else:
        # Nếu có Over-qualified thì vẫn nên bị trừ ít điểm
        gap = cv_exp - max_exp
        return max(70.0, 100.0 - gap * 5)

def compute_overall_score(job_row: pd.Series, cv_row: pd.Series) -> float:
    # Extract skills
    job_skills = load_skills(job_row.get('skills', ''))
    cv_domain_skills = load_skills(cv_row.get('domain_skills', ''))
    
    # Compute component scores
    skill_score = compute_skill_match_score(job_skills, cv_domain_skills)
    exp_score = compute_experience_score(
        job_row.get('min_experience'),
        cv_row.get('experience_years')
    )
    edu_score = compute_education_score(
        job_row.get('education'),
        cv_row.get('education')
    )
    seniority_score = compute_seniority_score(
        job_row.get('seniority'),
        cv_row.get('experience_years')
    )
    
    # Weighted average: Skills vẫn nên là thứ quan trọng nhất
    # 50% skills, 20% experience, 15% education, 15% seniority
    overall = (
        skill_score * 0.50 +
        exp_score * 0.20 +
        edu_score * 0.15 +
        seniority_score * 0.15
    )
    
    # Tạo noise để thực tế hơn
    noise = np.random.normal(0, 2)
    overall = np.clip(overall + noise, 0, 100)
    
    return round(overall, 2)

#Ghép JD với CV để tạo sample
def generate_training_pairs(jobs_df: pd.DataFrame, cvs_df: pd.DataFrame, samples_per_job: int = 50) -> pd.DataFrame:
    training_data = []
    
    print(f"Generating {samples_per_job} CV matches per job...")
    print(f"Total jobs: {len(jobs_df)}, Total CVs: {len(cvs_df)}")
    
    for job_idx, job_row in jobs_df.iterrows():
        # Lấy CV ngẫu nhiên cho job này
        if len(cvs_df) < samples_per_job:
            sampled_cvs = cvs_df
        else:
            sampled_cvs = cvs_df.sample(n=samples_per_job, replace=False)
        
        for cv_idx, cv_row in sampled_cvs.iterrows():
            score = compute_overall_score(job_row, cv_row)
            
            training_data.append({
                'job_id': job_idx,
                'cv_id': cv_idx,
                'score': score,
                'company': job_row.get('company_name', ''),
                'position': job_row.get('position_title', ''),
                'cv_category': cv_row.get('category', ''),
                'cv_industry': cv_row.get('industry', '')
            })
        
        if (job_idx + 1) % 100 == 0:
            print(f"Processed {job_idx + 1}/{len(jobs_df)} jobs...")
    
    return pd.DataFrame(training_data)

def main():
    print("=" * 60)
    print("Generating Training Data for Smart Recruit ML Model")
    print("=" * 60)

    print("\n1. Loading parsed job descriptions...")
    try:
        jobs_df = pd.read_csv('dataset/job_descriptions_parsed.csv')
        print(f"   ✓ Loaded {len(jobs_df)} jobs")
    except FileNotFoundError:
        print("   ✗ Error: job_descriptions_parsed.csv not found!")
        print("   Please run parse_job_descriptions.py first.")
        return
    
    print("\n2. Loading parsed CV features...")
    try:
        cvs_df = pd.read_csv('dataset/cv_features_parsed.csv')
        print(f"   ✓ Loaded {len(cvs_df)} CVs")
    except FileNotFoundError:
        print("   ✗ Error: cv_features_parsed.csv not found!")
        print("   Please run parse_resumes.py first.")
        return

    print("\n3. Generating training pairs...")
    samples_per_job = 50 # Ta sẽ lấy 50 CV cho 1 Job
    training_df = generate_training_pairs(jobs_df, cvs_df, samples_per_job)
    
    print(f"\n   ✓ Generated {len(training_df)} training samples")
    print(f"   Average score: {training_df['score'].mean():.2f}")
    print(f"   Score std: {training_df['score'].std():.2f}")
    
    print("\nScore distribution:")
    print(f"   0-20:  {(training_df['score'] < 20).sum()} samples")
    print(f"   20-40: {((training_df['score'] >= 20) & (training_df['score'] < 40)).sum()} samples")
    print(f"   40-60: {((training_df['score'] >= 40) & (training_df['score'] < 60)).sum()} samples")
    print(f"   60-80: {((training_df['score'] >= 60) & (training_df['score'] < 80)).sum()} samples")
    print(f"   80-100: {(training_df['score'] >= 80).sum()} samples")

    output_path = 'dataset/training_data.csv'
    try:
        training_df.to_csv(output_path, index=False)
        print(f"\n✓ Saved training data to: {output_path}")
    except PermissionError:
        print(f"\n✗ Error: Cannot write to {output_path}")
        print("   The file is currently open in another program (Excel, text editor, etc.)")
        print("   Please close the file and run the script again.")
        return

    print("\nSample training data:")
    print(training_df[['job_id', 'cv_id', 'score', 'position', 'cv_category']].head(10))
    
    print("\n" + "=" * 60)
    print("Training data generation complete!")
    print("=" * 60)

if __name__ == "__main__":
    main()
