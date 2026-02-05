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
    'critical thinking', 'adaptability', 'creativity', 'attention to detail',
    'analytical', 'organized', 'detail-oriented', 'self-motivated'
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

def extract_email(text: str) -> Optional[str]:
    if not text:
        return None
    
    pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    match = re.search(pattern, text)
    return match.group(0) if match else None

def extract_phone(text: str) -> Optional[str]:
    if not text:
        return None

    pattern = r'(\+?[0-9]{1,3}[-.\s]?)?(\(?[0-9]{2,4}\)?[-.\s]?)?[0-9]{3,}[-.\s]?[0-9]{3,}([-.\s]?[0-9]{2,})?'
    match = re.search(pattern, text)
    return match.group(0).strip() if match else None

def extract_experience_years(text: str) -> Optional[int]:
    if not text:
        return None
    
    text_lower = text.lower()

    patterns = [
        r'(\d+)\+?\s*years?\s+(?:of\s+)?(?:experience|exp)',
        r'experience\s*:?\s*(\d+)\+?\s*years?',
        r'(\d+)\s+years?\s+(?:professional|work)',
        r'(?:total|overall)\s+experience\s*:?\s*(\d+)\+?\s*years?',
        r'(\d+)\+?\s*yrs?\s+(?:of\s+)?(?:experience|exp)',
        r'work experience\s*:?\s*(\d+)\+?\s*years?',
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

def infer_experience_from_graduation(graduation_year: Optional[int], current_year: int = 2026) -> Optional[int]:
    if not graduation_year:
        return None
    
    years_since_grad = current_year - graduation_year

    if years_since_grad < 0:
        return 0
    elif years_since_grad <= 1:
        return 0
    elif years_since_grad <= 3:
        return years_since_grad - 1
    else:
        estimated_exp = int(years_since_grad * 0.8)
        return min(estimated_exp, 30)

def infer_experience_from_education(education: Optional[str]) -> Optional[int]:
    if not education:
        return None
    
    edu_exp_map = {
        'high school': 0,
        'associate': 0,
        'undergraduate': 0,
        'bachelor': 0,
        'master': 2,
        'phd': 5
    }
    return edu_exp_map.get(education.lower(), None)

def infer_experience_from_skills(skills: List[str]) -> Optional[int]:
    if not skills:
        return None
    
    # Sử dụng các kĩ năng khó để đánh giá năm kinh nghiệm
    advanced_skills = {
        'kubernetes', 'microservices', 'aws', 'azure', 'gcp', 'docker',
        'spring boot', 'django', 'angular', 'vue', 'mongodb', 'redis',
        'financial reporting', 'ifrs', 'gaap', 'auditing'
    }
    
    # Sử dụng các kĩ năng dễ để đánh giá năm kinh nghiệm
    basic_skills = {
        'excel', 'communication', 'teamwork', 'leadership', 'time management'
    }
    
    advanced_count = sum(1 for skill in skills if skill.lower() in advanced_skills)
    basic_only = all(skill.lower() in basic_skills for skill in skills)
    total_skills = len(skills)
    
    if advanced_count >= 5:
        return 7
    elif advanced_count >= 3:
        return 5
    elif advanced_count >= 1:
        return 3
    elif total_skills >= 7 and not basic_only:
        return 2
    elif total_skills >= 3:
        return 1
    else:
        return 0

def infer_cv_experience(explicit_exp: Optional[int], graduation_year: Optional[int], 
                        education: Optional[str], skills: List[str]) -> Optional[int]:
    
    # Ưu tiên thứ 1: Explicit kinh nghiệm từ text
    if explicit_exp is not None:
        return explicit_exp
    
    # Ưu tiên thứ 2: Tính từ năm tốt nghiệp
    exp_from_grad = infer_experience_from_graduation(graduation_year)
    if exp_from_grad is not None and exp_from_grad > 0:
        return exp_from_grad
    
    # Ưu tiên thứ 3: Kết hợp education và skills
    exp_from_edu = infer_experience_from_education(education)
    exp_from_skills = infer_experience_from_skills(skills)
    
    if exp_from_edu is not None and exp_from_skills is not None:
        return max(exp_from_edu, exp_from_skills)
    elif exp_from_skills is not None:
        return exp_from_skills
    elif exp_from_edu is not None:
        return exp_from_edu

    if graduation_year:
        years_since = 2026 - graduation_year
        if years_since >= 5:
            return 3
        elif years_since >= 2:
            return 1

    return None

def extract_education(text: str) -> Optional[str]:
    if not text:
        return None
    
    text_lower = text.lower()
    
    # Hierarchy: cao xuống thấp
    education_levels = [
        ('phd', r'\b(?:phd|ph\.?d\.?|doctorate|doctoral|doctor of philosophy)\b'),
        ('master', r'\b(?:master|masters|mba|m\.s\.?|ms|m\.a\.?|ma|graduate degree|post graduate|postgraduate)\b'),
        ('bachelor', r'\b(?:bachelor|bachelors|b\.s\.?|bs|b\.a\.?|ba|b\.tech|btech|b\.e|be|bsc|4[- ]?year degree|university degree|college degree)\b'),
        ('associate', r'\b(?:associate(?:s)? degree|a\.s\.?|a\.a\.?|aa|as|2[- ]?year degree)\b'),
        ('undergraduate', r'\b(?:undergraduate|undergrad|some college)\b'),
        ('high school', r'\b(?:high school|secondary school|diploma|ged)\b'),
    ]
    
    for level, pattern in education_levels:
        if re.search(pattern, text_lower):
            return level
    
    return None

def extract_graduation_year(text: str) -> Optional[int]:
    if not text:
        return None

    years = re.findall(r'\b(19|20)\d{2}\b', text)
    
    for year_str in years:
        year = int(year_str)
        if 1990 <= year <= 2030:
            return year
    
    return None

def extract_domain_skills(text: str) -> List[str]:
    if not text:
        return []
    
    text_lower = text.lower()
    found_skills = set()
    
    for skill in ALL_DOMAIN_SKILLS:
        if skill.lower() in text_lower:
            found_skills.add(skill)
    
    for variant, standard_skill in SKILL_VARIANTS.items():
        if standard_skill in ALL_DOMAIN_SKILLS:
            continue
        pattern = r'\b' + re.escape(variant) + r'\b'
        if re.search(pattern, text_lower):
            if standard_skill in ALL_DOMAIN_SKILLS:
                found_skills.add(standard_skill)
    
    return list(found_skills)

def extract_soft_skills(text: str) -> List[str]:
    if not text:
        return []
    
    text_lower = text.lower()
    found_skills = set()
    
    for skill in SOFT_SKILLS:
        if skill.lower() in text_lower:
            found_skills.add(skill)
    
    for variant, standard_skill in SKILL_VARIANTS.items():
        pattern = r'\b' + re.escape(variant) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.add(standard_skill)
    
    return list(found_skills)

def map_category_to_industry(category: str) -> str:
    category_lower = category.lower() if category else ""
    
    industry_mapping = {
        'information-technology': 'IT',
        'software': 'IT',
        'data science': 'IT',
        'web designing': 'IT',
        'database': 'IT',
        'network security engineer': 'IT',
        'devops': 'IT',
        
        'digital media': 'MARKETING',
        'marketing': 'MARKETING',
        'advertising': 'MARKETING',
        
        'sales': 'SALES',
        'business': 'SALES',
        
        'accounting': 'ACCOUNTING',
        'finance': 'FINANCE',
        'banking': 'FINANCE',
        
        'healthcare': 'HEALTHCARE',
        'nursing': 'HEALTHCARE',
        'medical': 'HEALTHCARE',
        
        'hr': 'HR',
        'human resources': 'HR',
        
        'education': 'EDUCATION',
        'teaching': 'EDUCATION',
        
        'construction': 'CONSTRUCTION',
        'engineering': 'MANUFACTURING',
        'automobile': 'MANUFACTURING',
        
        'arts': 'OTHER',
        'designer': 'OTHER',
        'consultant': 'OTHER',
    }
    
    for key, industry in industry_mapping.items():
        if key in category_lower:
            return industry
    
    return 'OTHER'

def parse_resume(row: pd.Series) -> Dict:
    resume_text = row.get('Resume_str', '') or row.get('Resume', '') or ''
    category = row.get('Category', 'Unknown')

    email = extract_email(resume_text)
    phone = extract_phone(resume_text)

    explicit_experience = extract_experience_years(resume_text)
    education = extract_education(resume_text)
    graduation_year = extract_graduation_year(resume_text)

    domain_skills = extract_domain_skills(resume_text)
    soft_skills = extract_soft_skills(resume_text)

    industry = map_category_to_industry(category)

    experience_years = infer_cv_experience(
        explicit_exp=explicit_experience,
        graduation_year=graduation_year,
        education=education,
        skills=domain_skills
    )
    
    return {
        'category': category,
        'industry': industry,
        'email': email,
        'phone': phone,
        'experience_years': experience_years,
        'education': education,
        'graduation_year': graduation_year,
        'domain_skills': json.dumps(domain_skills),
        'soft_skills': json.dumps(soft_skills),
        'resume_length': len(resume_text),
        'domain_skills_count': len(domain_skills),
        'soft_skills_count': len(soft_skills)
    }

def main():
    print("Loading Resume.csv...")

    chunk_size = 1000
    all_parsed_cvs = []
    
    try:
        for chunk_idx, chunk in enumerate(pd.read_csv('../dataset/raw/Resume.csv', chunksize=chunk_size)):
            print(f"\nProcessing chunk {chunk_idx + 1} ({len(chunk)} resumes)...")
            
            for idx, row in chunk.iterrows():
                try:
                    parsed = parse_resume(row)
                    all_parsed_cvs.append(parsed)
                except Exception as e:
                    print(f"Error parsing row {idx}: {e}")
                    continue
            
            print(f"Processed {len(all_parsed_cvs)} resumes so far...")

    except Exception as e:
        print(f"Error reading CSV: {e}")
        return

    output_df = pd.DataFrame(all_parsed_cvs)
    
    print(f"\n✓ Parsing complete! Parsed {len(output_df)} resumes.")
    print("\nSummary statistics:")
    print(f"- CVs with email: {output_df['email'].notna().sum()}")
    print(f"- CVs with phone: {output_df['phone'].notna().sum()}")
    print(f"- CVs with experience: {output_df['experience_years'].notna().sum()}")
    print(f"- CVs with education: {output_df['education'].notna().sum()}")
    print(f"- CVs with domain skills: {output_df['domain_skills_count'].gt(0).sum()}")
    
    print(f"\nAverage domain skills per CV: {output_df['domain_skills_count'].mean():.2f}")
    print(f"Average soft skills per CV: {output_df['soft_skills_count'].mean():.2f}")
    
    print("\nIndustry distribution:")
    print(output_df['industry'].value_counts())

    output_path = '../dataset/processed/cv_features_parsed.csv'
    try:
        output_df.to_csv(output_path, index=False)
        print(f"\n✓ Saved to: {output_path}")
    except PermissionError:
        print(f"\n✗ Error: Cannot write to {output_path}")
        print("   The file is currently open in another program (Excel, text editor, etc.)")
        print("   Please close the file and run the script again.")
        return

    print("\nSample parsed CVs:")
    print(output_df[['category', 'industry', 'experience_years', 'education', 'domain_skills_count']].head(10))

if __name__ == "__main__":
    main()
