import React, { useState } from 'react'
import { useAuth } from '@/store/AuthContext'
import s from './PortfolioPage.module.css'

const SKILLS = [
  { group: 'Test Automation', items: ['Selenium WebDriver', 'Appium', 'RestAssured', 'Cucumber/BDD', 'JUnit5', 'TestNG'] },
  { group: 'Frameworks',      items: ['Spring Boot', 'React', 'Node.js', 'Maven', 'Gradle'] },
  { group: 'Languages',       items: ['Java', 'Python', 'JavaScript', 'TypeScript', 'SQL'] },
  { group: 'Tools & DevOps',  items: ['JIRA', 'Git', 'GitHub Actions', 'PostgreSQL', 'Postman', 'Docker'] },
]

const EXPERIENCE = [
  {
    role:    'QA Automation Engineer',
    company: 'Previous Company',
    period:  '2019 – 2023',
    type:    'Full-time',
    points: [
      'Built Selenium WebDriver test suites covering 300+ UI scenarios across web applications',
      'Developed Appium test scripts for Android and iOS apps, integrated with CI/CD pipelines',
      'Wrote RestAssured API tests for 40+ endpoints with full positive/negative coverage',
      'Set up GitHub Actions workflows to run test suites on every pull request',
      'Reduced manual regression testing time by 70% through automation',
    ],
  },
  {
    role:    'Freelance Developer',
    company: 'Self-employed',
    period:  '2015 – 2018',
    type:    'Freelance',
    points: [
      'Built Android applications using Java and Android Studio',
      'Developed Python automation scripts for data processing and web scraping',
      'Delivered 10+ mobile and desktop apps for clients during college years',
    ],
  },
]

const PROJECTS = [
  {
    name:  'TestGen AI',
    desc:  'Full-stack SaaS platform that generates AI-powered test cases for any framework. Built with Spring Boot, React, PostgreSQL, and the Groq API.',
    stack: ['Spring Boot', 'React', 'PostgreSQL', 'Groq AI', 'JUnit5', 'GitHub Actions'],
    status: 'Live',
    link:  null,
    highlight: true,
  },
  {
    name:  'BuySell Store',
    desc:  'E-commerce web app with product listing, cart, JWT auth, and HuggingFace AI-powered product recommendations.',
    stack: ['Spring Boot', 'React', 'MySQL', 'JWT', 'HuggingFace API'],
    status: 'Complete',
    link:  null,
    highlight: false,
  },
]

export default function PortfolioPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('about')

  return (
    <div className={s.page}>

      {/* Hero card */}
      <div className={s.heroCard}>
        <div className={s.heroLeft}>
          <div className={s.avatar}>NA</div>
          <div>
            <h1 className={s.name}>{user?.name || 'Nilank Aman'}</h1>
            <p className={s.role}>QA Engineer · SDET · Full-Stack Developer</p>
            <p className={s.location}>📍 Tokyo, Japan</p>
            <div className={s.heroBadges}>
              <span className={s.heroBadge}>4 years QA experience</span>
              <span className={s.heroBadge}>Java · Python · JS</span>
              <span className={s.heroBadge}>Open to work</span>
            </div>
          </div>
        </div>

        <div className={s.heroRight}>
          <div className={s.contactLinks}>
            <a href="https://github.com" target="_blank" rel="noreferrer" className={s.contactLink}>
              <span>GitHub</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className={s.contactLink}>
              <span>LinkedIn</span>
            </a>
            <button className={s.downloadCv} onClick={() => window.print()}>
              ⬇ Download CV
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className={s.tabs}>
        {['about', 'experience', 'projects', 'skills'].map(tab => (
          <button
            key={tab}
            className={`${s.tab} ${activeTab === tab ? s.tabOn : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {{ about: '👤 About', experience: '💼 Experience', projects: '🚀 Projects', skills: '🛠 Skills' }[tab]}
          </button>
        ))}
      </div>

      {/* About */}
      {activeTab === 'about' && (
        <div className={s.section}>
          <div className={s.aboutGrid}>
            <div className={s.aboutText}>
              <h2 className={s.sTitle}>About me</h2>
              <p className={s.bio}>
                QA Engineer and SDET with 4 years of professional experience (2019–2023) building automation
                frameworks from scratch. I've worked across web, mobile, and API testing using Selenium,
                Appium, and RestAssured, and I'm comfortable on the full stack — Spring Boot on the backend,
                React on the frontend.
              </p>
              <p className={s.bio}>
                Currently based in Tokyo and studying Japanese. Actively looking for QA/SDET or full-stack
                developer roles at companies working on interesting products. I built TestGen AI as a portfolio
                project to demonstrate what I can do end to end — from database schema and API design to
                React UI and CI/CD integration.
              </p>

              <div className={s.quickFacts}>
                {[
                  { icon: '🎓', label: 'Education', value: 'Bachelor\'s degree · Amity University' },
                  { icon: '🌍', label: 'Languages', value: 'English · Japanese (N4–N3) · Hindi' },
                  { icon: '📅', label: 'Experience', value: '4 years professional + 3 years freelance' },
                  { icon: '🎯', label: 'Looking for', value: 'QA/SDET or Full-stack developer roles in Japan' },
                ].map(f => (
                  <div key={f.label} className={s.factRow}>
                    <span className={s.factIcon}>{f.icon}</span>
                    <div>
                      <p className={s.factLabel}>{f.label}</p>
                      <p className={s.factValue}>{f.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className={s.statsColumn}>
              {[
                { num: '4',    label: 'Years experience'   },
                { num: '300+', label: 'Test cases written'  },
                { num: '10+',  label: 'Frameworks known'    },
                { num: '2',    label: 'Portfolio projects'  },
              ].map(st => (
                <div key={st.label} className={s.statBox}>
                  <p className={s.statNum}>{st.num}</p>
                  <p className={s.statLbl}>{st.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Experience */}
      {activeTab === 'experience' && (
        <div className={s.section}>
          <h2 className={s.sTitle}>Work experience</h2>
          <div className={s.timeline}>
            {EXPERIENCE.map((job, i) => (
              <div key={i} className={s.timelineItem}>
                <div className={s.timelineDot} />
                <div className={s.timelineContent}>
                  <div className={s.jobHeader}>
                    <div>
                      <h3 className={s.jobRole}>{job.role}</h3>
                      <p className={s.jobCompany}>{job.company}</p>
                    </div>
                    <div className={s.jobMeta}>
                      <span className={s.jobPeriod}>{job.period}</span>
                      <span className={s.jobType}>{job.type}</span>
                    </div>
                  </div>
                  <ul className={s.jobPoints}>
                    {job.points.map((p, j) => (
                      <li key={j}>{p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects */}
      {activeTab === 'projects' && (
        <div className={s.section}>
          <h2 className={s.sTitle}>Projects</h2>
          <div className={s.projectGrid}>
            {PROJECTS.map((p, i) => (
              <div key={i} className={`${s.projectCard} ${p.highlight ? s.projectHighlight : ''}`}>
                {p.highlight && <div className={s.projectFeatured}>Featured Project</div>}
                <div className={s.projectHeader}>
                  <h3 className={s.projectName}>{p.name}</h3>
                  <span className={`${s.projectStatus} ${p.status === 'Live' ? s.statusLive : s.statusDone}`}>
                    {p.status === 'Live' ? '🟢 Live' : '✅ Complete'}
                  </span>
                </div>
                <p className={s.projectDesc}>{p.desc}</p>
                <div className={s.projectStack}>
                  {p.stack.map(tech => (
                    <span key={tech} className={s.stackTag}>{tech}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {activeTab === 'skills' && (
        <div className={s.section}>
          <h2 className={s.sTitle}>Skills</h2>
          <div className={s.skillsGrid}>
            {SKILLS.map(group => (
              <div key={group.group} className={s.skillGroup}>
                <h3 className={s.skillGroupTitle}>{group.group}</h3>
                <div className={s.skillTags}>
                  {group.items.map(skill => (
                    <span key={skill} className={s.skillTag}>{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
