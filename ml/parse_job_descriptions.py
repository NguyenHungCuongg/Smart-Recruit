import pandas as pd
import re
import json
from typing import List, Optional, Dict

IT_SKILLS = {
    'java', 'python', 'javascript', 'typescript', 'c#', 'c++', 'go', 'rust',
    'spring', 'spring boot', 'django', 'flask', 'react', 'angular', 'vue',
    'postgresql', 'mysql', 'mongodb', 'redis', 'sql', 'docker', 'kubernetes',
    'aws', 'azure', 'gcp', 'git', 'api', 'rest', 'microservices', 'agile'
}

MARKETING_SKILLS = {
    'seo', 'sem', 'google analytics', 'google ads', 'facebook ads', 'content marketing',
    'social media', 'email marketing', 'copywriting', 'brand management', 'digital marketing'
}

SALES_SKILLS = {
    'b2b', 'b2c', 'crm', 'salesforce', 'cold calling', 'lead generation',
    'negotiation', 'account management', 'sales strategy', 'pipeline management'
}

ACCOUNTING_SKILLS = {
    'gaap', 'ifrs', 'financial reporting', 'tax', 'auditing', 'bookkeeping',
    'quickbooks', 'excel', 'financial analysis', 'budgeting', 'sap', 'oracle'
}

HEALTHCARE_SKILLS = {
    'patient care', 'clinical', 'emr', 'hipaa', 'medical', 'nursing', 'cpr'
}

ALL_DOMAIN_SKILLS = IT_SKILLS | MARKETING_SKILLS | SALES_SKILLS | ACCOUNTING_SKILLS | HEALTHCARE_SKILLS

SOFT_SKILLS = {
    'teamwork', 'communication', 'leadership', 'problem solving', 'time management',
    'critical thinking', 'adaptability', 'creativity', 'attention to detail'
}

SKILL_VARIANTS = {
    'lead': 'leadership',
    'leading': 'leadership',
    'leader': 'leadership',

    'communicate': 'communication',
    'communicating': 'communication',
    'communicator': 'communication',

    'collaborate': 'teamwork',
    'collaboration': 'teamwork',
    'collaborative': 'teamwork',

    'solve': 'problem solving',
    'solving': 'problem solving',
    'solver': 'problem solving',

    'organize': 'time management',
    'organized': 'time management',
    'organizational': 'time management',
    'organization': 'time management',

    'analyze': 'critical thinking',
    'analytical': 'critical thinking',
    'analysis': 'critical thinking',

    'adapt': 'adaptability',
    'flexible': 'adaptability',
    'flexibility': 'adaptability',

    'creative': 'creativity',
    'innovate': 'creativity',
    'innovative': 'creativity',
    'innovation': 'creativity',

    'detail-oriented': 'attention to detail',
    'meticulous': 'attention to detail',
}

# Option[int] từ module Typing. Optional[int] ≡ int | None => Nghĩa là hàm này có thể trả về None hoặc int
def extract_experience(text: str) -> Optional[int]:
    if not text:
        return None
    
    text_lower = text.lower()

    patterns = [
        r'(\d+)\+?\s*years?\s+(?:of\s+)?(?:experience|exp)',
        r'(?:minimum|min|at least)\s+(\d+)\s+years?',
        r'(\d+)\s+years?\s+(?:minimum|required)',
        r'experience\s*:?\s*(\d+)\+?\s*years?',
        r'(\d+)\+?\s*yrs?\s+(?:of\s+)?(?:experience|exp)',
        r'with\s+(\d+)\+?\s*years?',
        r'at least\s+(\d+)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text_lower)
        if match:
            try:
                years = int(match.group(1))
                if 0 <= years <= 50:
                    return years
            except (ValueError, IndexError):
                continue
    
    return None

def extract_education(text: str) -> Optional[str]:
    if not text:
        return None
    
    text_lower = text.lower()
    
    education_levels = [
        ('phd', r'\b(?:phd|ph\.d|doctorate|doctoral)\b'),
        ('master', r'\b(?:master|masters|mba|m\.s|ms|m\.a|ma|graduate degree)\b'),
        ('bachelor', r'\b(?:bachelor|bachelors|b\.s|bs|b\.a|ba|undergraduate degree|university degree|college degree)\b'),
        ('undergraduate', r'\b(?:undergraduate|undergrad)\b'),
        ('high school', r'\b(?:high school|secondary school|diploma|ged)\b'),
    ]
    
    for level, pattern in education_levels:
        if re.search(pattern, text_lower):
            return level
    
    return None

def extract_skills(text: str) -> List[str]:
    if not text:
        return []
    
    text_lower = text.lower()
    found_skills = set()

    for skill in ALL_DOMAIN_SKILLS:
        if skill.lower() in text_lower:
            found_skills.add(skill)

    for skill in SOFT_SKILLS:
        if skill.lower() in text_lower:
            found_skills.add(skill)

    for variant, standard_skill in SKILL_VARIANTS.items():
        pattern = r'\b' + re.escape(variant) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.add(standard_skill)
    
    return list(found_skills)

def extract_seniority(text: str, position_title: str = "") -> Optional[str]:
    combined_text = (text + " " + position_title).lower()
    
    seniority_keywords = {
        'intern': r'\b(?:intern|internship|trainee)\b',
        'junior': r'\b(?:junior|jr|entry[\s-]?level|associate)\b',
        'mid': r'\b(?:mid[\s-]?level|intermediate|regular)\b',
        'senior': r'\b(?:senior|sr|lead|principal|staff)\b',
        'manager': r'\b(?:manager|management|director|head of)\b',
        'executive': r'\b(?:executive|vp|vice president|ceo|cto|cfo)\b'
    }
    
    for level, pattern in seniority_keywords.items():
        if re.search(pattern, combined_text):
            return level
    
    return None

def parse_job_description(row: pd.Series) -> Dict:
    company = row.get('company_name', 'Unknown')
    position = row.get('position_title', 'Unknown')
    description = row.get('job_description', '')
    
    skills = extract_skills(description)
    min_experience = extract_experience(description)
    education = extract_education(description)
    seniority = extract_seniority(description, position)
    
    return {
        'company_name': company,
        'position_title': position,
        'skills': json.dumps(skills),
        'min_experience': min_experience,
        'education': education,
        'seniority': seniority,
        'description_length': len(description),
        'skills_count': len(skills)
    }

def main():

    df = pd.read_csv('dataset/Job_description.csv')
    
    print(f"Total job descriptions: {len(df)}")
    print(f"Columns: {df.columns.tolist()}")
    
    print("\nParsing job descriptions...")
    parsed_jobs = []
    
    for idx, row in df.iterrows():
        try:
            parsed = parse_job_description(row)
            parsed_jobs.append(parsed)
            
            if (idx + 1) % 100 == 0:
                print(f"Processed {idx + 1}/{len(df)} job descriptions...")
        except Exception as e:
            print(f"Error parsing row {idx}: {e}")
            continue
    
    output_df = pd.DataFrame(parsed_jobs)
    
    print(f"\nParsing complete! Parsed {len(output_df)} job descriptions.")
    print("\nSummary statistics:")
    print(f"- Jobs with skills: {output_df['skills_count'].gt(0).sum()}")
    print(f"- Jobs with experience requirement: {output_df['min_experience'].notna().sum()}")
    print(f"- Jobs with education requirement: {output_df['education'].notna().sum()}")
    print(f"- Jobs with seniority: {output_df['seniority'].notna().sum()}")
    print(f"\nAverage skills per job: {output_df['skills_count'].mean():.2f}")
    
    output_path = 'dataset/job_descriptions_parsed.csv'
    try:
        output_df.to_csv(output_path, index=False)
        print(f"\n✓ Saved to: {output_path}")
    except PermissionError:
        print(f"\n✗ Error: Cannot write to {output_path}")
        print("   The file is currently open in another program (Excel, text editor, etc.)")
        print("   Please close the file and run the script again.")
        return
    
    print("\nSample parsed jobs:")
    print(output_df[['company_name', 'position_title', 'skills_count', 'min_experience', 'education', 'seniority']].head(10))

if __name__ == "__main__":
    main()
