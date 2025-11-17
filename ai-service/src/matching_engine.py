# -*- coding: utf-8 -*-
from typing import Dict, List
import os
from dotenv import load_dotenv

load_dotenv()


class MatchingEngine:
    """
    Engine to calculate candidate-job match score
    """

    def __init__(self):
        self.skill_weight = 0.5
        self.experience_weight = 0.3
        self.education_weight = 0.2

    def calculate_match(self, parsed_resume: Dict, job_requirements: Dict) -> Dict:
        """
        Calculate match score between candidate and job requirements
        """
        # Extract candidate data - handle both dict and string formats for skills
        skills_data = parsed_resume.get("skills", [])
        candidate_skills = []
        for s in skills_data:
            if isinstance(s, dict):
                candidate_skills.append(s.get("name", "").lower())
            elif isinstance(s, str):
                candidate_skills.append(s.lower())

        candidate_experience = parsed_resume.get("experience", [])
        candidate_education = parsed_resume.get("education", [])

        # Extract job requirements
        required_skills = job_requirements.get("skills", [])
        required_experience = job_requirements.get("experience", {})
        required_education = job_requirements.get("education", "")

        # Calculate skill match
        skill_score = self._calculate_skill_match(candidate_skills, required_skills)

        # Calculate experience match
        experience_score = self._calculate_experience_match(
            len(candidate_experience),
            required_experience
        )

        # Calculate education match
        education_score = self._calculate_education_match(
            candidate_education,
            required_education
        )

        # Weighted total score
        total_score = (
            skill_score * self.skill_weight +
            experience_score * self.experience_weight +
            education_score * self.education_weight
        ) * 100

        # Generate summary
        summary = self._generate_summary(total_score, skill_score, experience_score, education_score)

        # Identify strengths and weaknesses
        strengths = self._identify_strengths(
            skill_score,
            experience_score,
            education_score,
            candidate_skills,
            required_skills
        )

        weaknesses = self._identify_weaknesses(
            skill_score,
            experience_score,
            education_score,
            candidate_skills,
            required_skills
        )

        return {
            "score": round(total_score, 2),
            "summary": summary,
            "strengths": strengths,
            "weaknesses": weaknesses,
            "breakdown": {
                "skills": round(skill_score * 100, 2),
                "experience": round(experience_score * 100, 2),
                "education": round(education_score * 100, 2)
            }
        }

    def _calculate_skill_match(self, candidate_skills: List[str], required_skills: List) -> float:
        """Calculate skill match score (0-1)"""
        if not required_skills:
            return 0.8  # Default score if no requirements

        # Count matches
        matched_skills = 0
        required_count = 0

        for req_skill in required_skills:
            skill_name = req_skill.get("name", "").lower() if isinstance(req_skill, dict) else str(req_skill).lower()
            importance = req_skill.get("importance", "Required") if isinstance(req_skill, dict) else "Required"

            # Weight based on importance
            if importance == "Required":
                weight = 1.0
                required_count += weight
                if skill_name in candidate_skills:
                    matched_skills += weight
            elif importance == "Preferred":
                weight = 0.5
                required_count += weight
                if skill_name in candidate_skills:
                    matched_skills += weight
            else:  # Nice to have
                weight = 0.25
                required_count += weight
                if skill_name in candidate_skills:
                    matched_skills += weight

        if required_count == 0:
            return 0.8

        return min(matched_skills / required_count, 1.0)

    def _calculate_experience_match(self, candidate_years: int, required_experience: Dict) -> float:
        """Calculate experience match score (0-1)"""
        if not required_experience:
            return 0.8

        # Handle both dict and string formats for experience
        if isinstance(required_experience, str):
            # Parse string like "2 years" or just return default
            return 0.8  # Default score if experience is a string
        elif isinstance(required_experience, dict):
            min_exp = required_experience.get("min", 0)
            max_exp = required_experience.get("max", 100)
        else:
            return 0.8  # Default if unknown format

        # Estimate years based on number of entries (rough estimate)
        estimated_years = candidate_years * 2  # Assume avg 2 years per entry

        if estimated_years < min_exp:
            # Below minimum
            return max(0.3, estimated_years / min_exp)
        elif estimated_years > max_exp:
            # Over qualified
            return 0.9
        else:
            # Within range
            return 1.0

    def _calculate_education_match(self, candidate_education: List[Dict], required_education: str) -> float:
        """Calculate education match score (0-1)"""
        if not required_education or required_education == "Any":
            return 1.0

        if not candidate_education:
            return 0.4

        # Education hierarchy
        education_levels = {
            "high school": 1,
            "associate": 2,
            "bachelor": 3,
            "master": 4,
            "phd": 5
        }

        # Get required level
        required_level = education_levels.get(required_education.lower(), 3)

        # Check candidate's highest education
        candidate_max_level = 0
        for edu in candidate_education:
            # Handle both dict and string formats
            if isinstance(edu, dict):
                degree = edu.get("degree", "").lower()
            elif isinstance(edu, str):
                degree = edu.lower()
            else:
                continue
            for level_name, level_value in education_levels.items():
                if level_name in degree:
                    candidate_max_level = max(candidate_max_level, level_value)

        if candidate_max_level == 0:
            return 0.5  # Unable to determine

        if candidate_max_level >= required_level:
            return 1.0
        else:
            return candidate_max_level / required_level

    def _generate_summary(self, total_score: float, skill_score: float, exp_score: float, edu_score: float) -> str:
        """Generate a professional summary based on scores"""
        # Determine overall fit
        if total_score >= 85:
            fit_level = "exceptional"
            recommendation = "This candidate demonstrates outstanding qualifications and is highly recommended for immediate consideration."
        elif total_score >= 70:
            fit_level = "strong"
            recommendation = "This candidate shows strong alignment with the position requirements and would be a valuable addition to the team."
        elif total_score >= 55:
            fit_level = "moderate"
            recommendation = "This candidate meets several key requirements and may be suitable with additional assessment or training."
        elif total_score >= 40:
            fit_level = "limited"
            recommendation = "This candidate demonstrates some relevant qualifications but may require significant development to meet all requirements."
        else:
            fit_level = "minimal"
            recommendation = "This candidate's current qualifications do not closely align with the position requirements."

        # Analyze component strengths
        components = []
        if skill_score >= 0.8:
            components.append("possesses excellent technical competencies")
        elif skill_score >= 0.6:
            components.append("demonstrates solid technical skills")
        elif skill_score >= 0.4:
            components.append("shows foundational technical abilities")
        else:
            components.append("has limited alignment with required technical skills")

        if exp_score >= 0.9:
            components.append("brings substantial relevant experience")
        elif exp_score >= 0.7:
            components.append("has appropriate professional background")
        elif exp_score >= 0.5:
            components.append("possesses moderate work experience")
        else:
            components.append("has limited relevant experience")

        if edu_score >= 0.9:
            components.append("meets or exceeds educational requirements")
        elif edu_score >= 0.7:
            components.append("has suitable educational credentials")
        elif edu_score >= 0.5:
            components.append("possesses adequate educational background")
        else:
            components.append("may not fully meet educational prerequisites")

        # Construct professional summary
        summary = f"This candidate represents a {fit_level} fit for the position (Overall Score: {int(total_score)}%). "
        summary += f"The candidate {', '.join(components)}. "
        summary += recommendation

        return summary

    def _identify_strengths(self, skill_score: float, exp_score: float, edu_score: float,
                           candidate_skills: List[str], required_skills: List) -> List[str]:
        """Identify candidate's strengths"""
        strengths = []

        if skill_score >= 0.8:
            strengths.append("Strong technical skill match")

        if exp_score >= 0.9:
            strengths.append("Excellent relevant experience")

        if edu_score >= 0.9:
            strengths.append("Meets or exceeds education requirements")

        # Check for bonus skills
        required_skill_names = []
        for r in required_skills:
            if isinstance(r, dict):
                required_skill_names.append(str(r.get("name", "")).lower())
            elif isinstance(r, str):
                required_skill_names.append(str(r).lower())

        bonus_skills = [s for s in candidate_skills if s not in required_skill_names]

        if len(bonus_skills) > 5:
            strengths.append(f"Diverse skill set with {len(bonus_skills)} additional skills")

        if not strengths:
            strengths.append("Basic qualifications met")

        return strengths

    def _identify_weaknesses(self, skill_score: float, exp_score: float, edu_score: float,
                            candidate_skills: List[str], required_skills: List) -> List[str]:
        """Identify areas for improvement"""
        weaknesses = []

        if skill_score < 0.5:
            # Find missing required skills
            missing = []
            for req in required_skills:
                skill_name = req.get("name", "").lower() if isinstance(req, dict) else str(req).lower()
                if skill_name not in candidate_skills:
                    missing.append(skill_name)

            if missing:
                weaknesses.append(f"Missing key skills: {', '.join(missing[:3])}")

        if exp_score < 0.5:
            weaknesses.append("Limited relevant work experience")

        if edu_score < 0.7:
            weaknesses.append("Education level below preferred requirements")

        if not weaknesses:
            weaknesses.append("No significant weaknesses identified")

        return weaknesses

    def recommend_job_roles(self, parsed_resume: Dict) -> List[Dict]:
        """
        Recommend suitable job roles based on candidate's skills, experience, and education
        """
        # Handle both dict and string formats for skills
        skills_data = parsed_resume.get("skills", [])
        candidate_skills = []
        for s in skills_data:
            if isinstance(s, dict):
                candidate_skills.append(s.get("name", "").lower())
            elif isinstance(s, str):
                candidate_skills.append(s.lower())

        candidate_experience = parsed_resume.get("experience", [])
        candidate_education = parsed_resume.get("education", [])

        # Define job role patterns with required skills and descriptions
        job_role_patterns = {
            "Full Stack Developer": {
                "keywords": ["javascript", "react", "node.js", "express", "mongodb", "sql", "html", "css", "rest api"],
                "min_match": 4,
                "description": "Designs and develops both client and server-side applications",
                "seniority": self._estimate_seniority(len(candidate_experience))
            },
            "Frontend Developer": {
                "keywords": ["react", "angular", "vue", "javascript", "typescript", "html", "css", "tailwind", "bootstrap"],
                "min_match": 3,
                "description": "Creates user interfaces and client-side functionality",
                "seniority": self._estimate_seniority(len(candidate_experience))
            },
            "Backend Developer": {
                "keywords": ["python", "java", "node.js", "express", "django", "flask", "fastapi", "spring", "sql", "mongodb", "rest api"],
                "min_match": 3,
                "description": "Builds server-side logic and database architecture",
                "seniority": self._estimate_seniority(len(candidate_experience))
            },
            "DevOps Engineer": {
                "keywords": ["docker", "kubernetes", "ci/cd", "jenkins", "aws", "azure", "gcp", "terraform", "github actions"],
                "min_match": 3,
                "description": "Manages infrastructure and deployment pipelines",
                "seniority": self._estimate_seniority(len(candidate_experience))
            },
            "Data Scientist": {
                "keywords": ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "scikit-learn", "pandas", "numpy"],
                "min_match": 4,
                "description": "Analyzes data and builds predictive models",
                "seniority": self._estimate_seniority(len(candidate_experience))
            },
            "Machine Learning Engineer": {
                "keywords": ["python", "machine learning", "deep learning", "tensorflow", "pytorch", "nlp", "computer vision"],
                "min_match": 3,
                "description": "Develops and deploys ML models and AI systems",
                "seniority": self._estimate_seniority(len(candidate_experience))
            },
            "Mobile Developer": {
                "keywords": ["react native", "flutter", "android", "ios", "swift", "kotlin", "java"],
                "min_match": 2,
                "description": "Creates mobile applications for iOS and Android",
                "seniority": self._estimate_seniority(len(candidate_experience))
            },
            "Cloud Architect": {
                "keywords": ["aws", "azure", "gcp", "docker", "kubernetes", "microservices", "terraform"],
                "min_match": 3,
                "description": "Designs scalable cloud infrastructure solutions",
                "seniority": self._estimate_seniority(len(candidate_experience))
            },
            "Software Engineer": {
                "keywords": ["python", "java", "javascript", "c++", "c#", "go", "rust"],
                "min_match": 2,
                "description": "Develops software applications and systems",
                "seniority": self._estimate_seniority(len(candidate_experience))
            },
            "QA Engineer": {
                "keywords": ["testing", "automation", "selenium", "cypress", "jest", "ci/cd"],
                "min_match": 2,
                "description": "Ensures software quality through testing and automation",
                "seniority": self._estimate_seniority(len(candidate_experience))
            }
        }

        recommendations = []

        # Calculate match for each role
        for role_name, role_data in job_role_patterns.items():
            matched_keywords = [kw for kw in role_data["keywords"] if kw in candidate_skills]
            match_count = len(matched_keywords)

            if match_count >= role_data["min_match"]:
                match_percentage = min(100, int((match_count / len(role_data["keywords"])) * 100))

                # Adjust for education level
                education_boost = self._get_education_boost(candidate_education)
                match_percentage = min(100, match_percentage + education_boost)

                recommendations.append({
                    "role": f"{role_data['seniority']} {role_name}",
                    "matchPercentage": match_percentage,
                    "description": role_data["description"],
                    "matchedSkills": matched_keywords[:5],  # Top 5 matched skills
                    "reason": f"Strong alignment with {match_count} key skills including {', '.join(matched_keywords[:3])}"
                })

        # Sort by match percentage
        recommendations.sort(key=lambda x: x["matchPercentage"], reverse=True)

        # Return top 5 recommendations
        return recommendations[:5] if recommendations else [{
            "role": "Entry Level Software Developer",
            "matchPercentage": 50,
            "description": "General software development role suitable for candidates building their career",
            "matchedSkills": candidate_skills[:3],
            "reason": "Based on foundational technical skills"
        }]

    def _estimate_seniority(self, experience_count: int) -> str:
        """Estimate seniority level based on experience count"""
        if experience_count >= 4:
            return "Senior"
        elif experience_count >= 2:
            return "Mid-Level"
        else:
            return "Junior"

    def _get_education_boost(self, education: List[Dict]) -> int:
        """Get boost percentage based on education level"""
        if not education:
            return 0

        highest_degree = ""
        for edu in education:
            # Handle both dict and string formats
            if isinstance(edu, dict):
                degree = edu.get("degree", "").lower()
            elif isinstance(edu, str):
                degree = edu.lower()
            else:
                continue
            highest_degree = degree if len(degree) > len(highest_degree) else highest_degree

        if "phd" in highest_degree or "doctor" in highest_degree:
            return 15
        elif "master" in highest_degree or "mba" in highest_degree:
            return 10
        elif "bachelor" in highest_degree:
            return 5
        else:
            return 0


# Test the matching engine
if __name__ == "__main__":
    engine = MatchingEngine()

    # Sample test
    sample_resume = {
        "skills": [
            {"name": "Python", "proficiency": "Advanced"},
            {"name": "JavaScript", "proficiency": "Intermediate"},
            {"name": "React", "proficiency": "Advanced"}
        ],
        "experience": [
            {"company": "Tech Corp", "position": "Developer", "duration": "2 years"}
        ],
        "education": [
            {"degree": "Bachelor of Science", "field": "Computer Science"}
        ]
    }

    sample_job = {
        "skills": [
            {"name": "Python", "importance": "Required"},
            {"name": "React", "importance": "Required"},
            {"name": "Node.js", "importance": "Preferred"}
        ],
        "experience": {"min": 2, "max": 5},
        "education": "Bachelor"
    }

    result = engine.calculate_match(sample_resume, sample_job)
    print(result)
