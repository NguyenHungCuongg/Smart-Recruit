import pandas as pd
import re
import json
from typing import List, Optional, Dict

# Skill keywords by industry (same as job parsing)
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

def extract_email(text: str) -> Optional[str]:
    if not text:
        return None
    
    pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
    match = re.search(pattern, text)
    return match.group(0) if match else None

def extract_phone(text: str) -> Optional[str]:
    if not text:
        return None
    
    # Pattern for phone numbers
    pattern = r'(\+?[0-9]{1,3}[-.\s]?)?(\(?[0-9]{2,4}\)?[-.\s]?)?[0-9]{3,}[-.\s]?[0-9]{3,}([-.\s]?[0-9]{2,})?'
    match = re.search(pattern, text)
    return match.group(0).strip() if match else None

def extract_experience_years(text: str) -> Optional[int]:
    if not text:
        return None
    
    text_lower = text.lower()
    
    # Patterns: "5 years of experience", "experience: 3+ years"
    patterns = [
        r'(\d+)\+?\s*years?\s+(?:of\s+)?(?:experience|exp)',
        r'experience\s*:?\s*(\d+)\+?\s*years?',
        r'(\d+)\s+years?\s+(?:professional|work)',
    ]
    
    for pattern in patterns:
        match = re.search(pattern, text_lower)
        if match:
            return int(match.group(1))
    
    return None

def extract_education(text: str) -> Optional[str]:
    if not text:
        return None
    
    text_lower = text.lower()
    
    education_levels = [
        ('phd', r'\b(?:phd|ph\.d|doctorate|doctoral)\b'),
        ('master', r'\b(?:master|masters|mba|m\.s|ms|m\.a|ma)\b'),
        ('bachelor', r'\b(?:bachelor|bachelors|b\.s|bs|b\.a|ba|b\.tech|btech|b\.e|be)\b'),
    ]
    
    for level, pattern in education_levels:
        if re.search(pattern, text_lower):
            return level
    
    return None

def extract_graduation_year(text: str) -> Optional[int]:
    if not text:
        return None
    
    # Find 4-digit years between 1990-2030
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
    found_skills = []
    
    for skill in ALL_DOMAIN_SKILLS:
        if skill.lower() in text_lower:
            found_skills.append(skill)
    
    return found_skills

def extract_soft_skills(text: str) -> List[str]:
    if not text:
        return []
    
    text_lower = text.lower()
    found_skills = []
    
    for skill in SOFT_SKILLS:
        if skill.lower() in text_lower:
            found_skills.append(skill)
    
    return found_skills

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
    
    # Extract features
    email = extract_email(resume_text)
    phone = extract_phone(resume_text)
    experience_years = extract_experience_years(resume_text)
    education = extract_education(resume_text)
    graduation_year = extract_graduation_year(resume_text)
    domain_skills = extract_domain_skills(resume_text)
    soft_skills = extract_soft_skills(resume_text)
    industry = map_category_to_industry(category)
    
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
    print("(This may take a while due to large file size...)")
    
    # Read CSV in chunks to handle large file
    chunk_size = 1000
    all_parsed_cvs = []
    
    try:
        for chunk_idx, chunk in enumerate(pd.read_csv('dataset/Resume.csv', chunksize=chunk_size)):
            print(f"\nProcessing chunk {chunk_idx + 1} ({len(chunk)} resumes)...")
            
            for idx, row in chunk.iterrows():
                try:
                    parsed = parse_resume(row)
                    all_parsed_cvs.append(parsed)
                except Exception as e:
                    print(f"Error parsing row {idx}: {e}")
                    continue
            
            print(f"Processed {len(all_parsed_cvs)} resumes so far...")
            
            # Optional: limit for testing
            # if len(all_parsed_cvs) >= 5000:
            #     print("Reached 5000 resumes limit for testing")
            #     break
    
    except Exception as e:
        print(f"Error reading CSV: {e}")
        return
    
    # Create output DataFrame
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
    
    # Save to CSV
    output_path = 'dataset/cv_features_parsed.csv'
    output_df.to_csv(output_path, index=False)
    print(f"\n✓ Saved to: {output_path}")
    
    # Display sample
    print("\nSample parsed CVs:")
    print(output_df[['category', 'industry', 'experience_years', 'education', 'domain_skills_count']].head(10))

if __name__ == "__main__":
    main()
