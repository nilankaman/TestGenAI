import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import ExportBar from '@/components/ui/ExportBar'
import s from './GeneratePage.module.css'

const FRAMEWORKS = [
  { id: 'junit5',      label: 'JUnit5',      lang: 'Java'    },
  { id: 'testng',      label: 'TestNG',       lang: 'Java'    },
  { id: 'selenium',    label: 'Selenium',     lang: 'Java'    },
  { id: 'appium',      label: 'Appium',       lang: 'Java'    },
  { id: 'restassured', label: 'RestAssured',  lang: 'Java'    },
  { id: 'cypress',     label: 'Cypress',      lang: 'JS'      },
  { id: 'playwright',  label: 'Playwright',   lang: 'JS/TS'   },
  { id: 'cucumber',    label: 'Cucumber/BDD', lang: 'BDD'     },
  { id: 'pytest',      label: 'Pytest',       lang: 'Python'  },
  { id: 'jest',        label: 'Jest',         lang: 'JS'      },
]

const TYPE_COLORS = {
  POSITIVE: { bg: 'rgba(74,222,128,0.1)',  text: '#4ade80',  border: 'rgba(74,222,128,0.3)'  },
  NEGATIVE: { bg: 'rgba(248,113,113,0.1)', text: '#f87171',  border: 'rgba(248,113,113,0.3)' },
  EDGE:     { bg: 'rgba(251,146,60,0.1)',  text: '#fb923c',  border: 'rgba(251,146,60,0.3)'  },
}

function TestCaseCard({ tc, index }) {
  const [codeOpen, setCodeOpen] = useState(false)
  const [copied,   setCopied]   = useState(false)
  const col = TYPE_COLORS[tc.type] || TYPE_COLORS.POSITIVE

  function copy() {
    navigator.clipboard.writeText(tc.codeSnippet || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={s.card}>
      <div className={s.cardHeader}>
        <span className={s.cardNum}>{index + 1}</span>
        <span className={s.typeBadge} style={{ background: col.bg, color: col.text, borderColor: col.border }}>
          {tc.type}
        </span>
        <h3 className={s.cardTitle}>{tc.title}</h3>
      </div>

      {tc.methodName && (
        <p className={s.method}>⚙ <code>{tc.methodName}()</code></p>
      )}

      <p className={s.cardDesc}>{tc.description}</p>

      {tc.codeSnippet && (
        <div className={s.codeSection}>
          <button className={s.codeToggle} onClick={() => setCodeOpen(v => !v)}>
            {codeOpen ? '▲ Hide code' : '▼ Show code'}
          </button>
          {codeOpen && (
            <div className={s.codeWrap}>
              <button className={s.copyBtn} onClick={copy}>
                {copied ? ' Copied' : '⎘ Copy'}
              </button>
              <pre className={s.pre}><code>{tc.codeSnippet}</code></pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Builds a prompt that tells Groq exactly what kind of script to write
function buildScriptPrompt(framework, description) {
  const templates = {
    selenium: `Write a complete, production-ready Selenium WebDriver test class in Java for: "${description}". Use JUnit5 annotations. Include ChromeDriver setup, explicit waits with WebDriverWait, realistic CSS selectors, assertions, and teardown. Return only the Java code.`,
    cypress:  `Write a complete Cypress test file in JavaScript for: "${description}". Use describe/it blocks, cy.visit, realistic selectors, cy.intercept for mocking, and assertions. Include a happy path and one error scenario. Return only the JavaScript code.`,
    playwright: `Write a complete Playwright test in TypeScript for: "${description}". Use test.describe and test blocks. Include page.goto, getByRole/getByTestId locators, expect assertions, and one screenshot call. Return only the TypeScript code.`,
    pytest:   `Write a complete Pytest test file in Python for: "${description}". Use class structure, setup_method/teardown_method fixtures, requests library for HTTP, and assert statements. Return only the Python code.`,
    restassured: `Write a complete RestAssured API test class in Java for: "${description}". Use JUnit5, given().when().then() chains, JSON body payloads, and Hamcrest matchers. Return only the Java code.`,
    junit5:   `Write a complete JUnit5 test class in Java for: "${description}". Use @Test, @BeforeEach, @AfterEach, @DisplayName, and Mockito mocks where needed. Return only the Java code.`,
    appium:   `Write a complete Appium mobile test class in Java for: "${description}". Use JUnit5, AppiumDriver, MobileBy selectors, and realistic mobile test steps for Android. Return only the Java code.`,
    cucumber: `Write a complete Cucumber BDD feature file AND step definitions in Java for: "${description}". Separate them with a clear FILE: comment. Use Given/When/Then in the feature file and @Given/@When/@Then in the step definitions. Return only the code.`,
    jest:     `Write a complete Jest test file in JavaScript for: "${description}". Use describe/test, jest.mock for dependencies, async/await, and multiple expect matchers. Return only the JavaScript code.`,
    testng:   `Write a complete TestNG test class in Java for: "${description}". Use @Test, @BeforeMethod, @AfterMethod, @DataProvider for parameterized cases, and TestNG Assert. Return only the Java code.`,
  }
  return templates[framework] || templates.junit5
}

export default function GeneratePage() {
  const location = useLocation()

  const [tab,       setTab]       = useState(location.state?.tab || 'manual')
  const [desc,      setDesc]      = useState(location.state?.desc || '')
  const [framework, setFramework] = useState('junit5')
  const [scriptFw,  setScriptFw]  = useState(location.state?.fw || 'selenium')
  const [coverage,  setCoverage]  = useState('ALL')
  const [format,    setFormat]    = useState('CODE')

  const [results,       setResults]       = useState(null)
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState('')
  const [scriptCode,    setScriptCode]    = useState('')
  const [scriptLoading, setScriptLoading] = useState(false)
  const [scriptCopied,  setScriptCopied]  = useState(false)

  async function generate() {
    if (!desc.trim()) { setError('Please describe the feature first.'); return }
    setError('')
    setLoading(true)
    setResults(null)
    try {
      const res = await fetch('/api/v1/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          featureDescription: desc,
          framework:    tab === 'auto' ? framework : 'plain',
          outputFormat: tab === 'manual' ? 'PLAIN' : format,
          coverageType: coverage,
          uiLanguage:   'en',
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Generation failed')
      setResults(data)
    } catch (e) {
      setError(e.message || 'Backend offline — start the Spring Boot server.')
    } finally {
      setLoading(false)
    }
  }

  async function buildScript() {
    if (!desc.trim()) { setError('Describe the feature first.'); return }
    setError('')
    setScriptCode('')
    setScriptLoading(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: buildScriptPrompt(scriptFw, desc) }]
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.message || 'Script generation failed')
      // Strip markdown code fences if the AI added them
      const clean = (data.reply || '').replace(/^```[\w]*\n?/m, '').replace(/\n?```$/m, '').trim()
      setScriptCode(clean)
    } catch (e) {
      setError(e.message || 'Script generation failed. Is the backend running?')
    } finally {
      setScriptLoading(false)
    }
  }

  function copyScript() {
    navigator.clipboard.writeText(scriptCode)
    setScriptCopied(true)
    setTimeout(() => setScriptCopied(false), 2500)
  }

  const isLoading = loading || scriptLoading

  return (
    <div className={s.page}>

      {/* Left panel */}
      <div className={s.left}>
        <div className={s.leftTop}>
          <h1 className={s.title}>Generate Test Cases</h1>
          <div className={s.modeTabs}>
            <button className={`${s.modeTab} ${tab === 'manual' ? s.modeTabOn : ''}`} onClick={() => setTab('manual')}>
              📋 Manual
            </button>
            <button className={`${s.modeTab} ${tab === 'auto' ? s.modeTabOn : ''}`} onClick={() => setTab('auto')}>
              ⚙️ Automation
            </button>
            <button className={`${s.modeTab} ${tab === 'script' ? s.modeTabOn : ''}`} onClick={() => setTab('script')}>
              📝 Script
            </button>
          </div>
        </div>

        <div className={s.field}>
          <label className={s.lbl}>
            {tab === 'script' ? 'Describe the test scenario' : 'Feature description'}
          </label>
          <textarea
            className={s.textarea}
            value={desc}
            onChange={e => setDesc(e.target.value)}
            placeholder={
              tab === 'script'
                ? 'e.g. login with email and password\ne.g. add item to cart and checkout'
                : 'e.g. User login with email and password. Return JWT on success, lock account after 5 failed attempts.'
            }
            rows={6}
          />
        </div>

        {tab === 'auto' && (
          <div className={s.field}>
            <label className={s.lbl}>Framework</label>
            <div className={s.frameworks}>
              {FRAMEWORKS.map(fw => (
                <button
                  key={fw.id}
                  className={`${s.fwBtn} ${framework === fw.id ? s.fwBtnOn : ''}`}
                  onClick={() => setFramework(fw.id)}
                >
                  <span className={s.fwLabel}>{fw.label}</span>
                  <span className={s.fwLang}>{fw.lang}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {tab === 'script' && (
          <div className={s.field}>
            <label className={s.lbl}>Generate script for</label>
            <div className={s.frameworks}>
              {FRAMEWORKS.map(fw => (
                <button
                  key={fw.id}
                  className={`${s.fwBtn} ${scriptFw === fw.id ? s.fwBtnOn : ''}`}
                  onClick={() => setScriptFw(fw.id)}
                >
                  <span className={s.fwLabel}>{fw.label}</span>
                  <span className={s.fwLang}>{fw.lang}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {tab !== 'script' && (
          <div className={s.row2}>
            <div className={s.field}>
              <label className={s.lbl}>Coverage</label>
              <select className={s.select} value={coverage} onChange={e => setCoverage(e.target.value)}>
                <option value="ALL">All types</option>
                <option value="POSITIVE">Positive</option>
                <option value="NEGATIVE">Negative</option>
                <option value="EDGE">Edge cases</option>
              </select>
            </div>
            {tab === 'auto' && (
              <div className={s.field}>
                <label className={s.lbl}>Format</label>
                <select className={s.select} value={format} onChange={e => setFormat(e.target.value)}>
                  <option value="CODE">Code</option>
                  <option value="GHERKIN">Gherkin</option>
                  <option value="PLAIN">Plain text</option>
                </select>
              </div>
            )}
          </div>
        )}

        {error && <div className={s.error}>{error}</div>}

        {tab !== 'script' && (
          <button className={s.generateBtn} onClick={generate} disabled={loading}>
            {loading
              ? <><span className={s.spinner} /> Generating…</>
              : `⚡ Generate ${tab === 'manual' ? 'manual' : 'automation'} cases`
            }
          </button>
        )}

        {tab === 'script' && (
          <>
            <button className={s.generateBtn} onClick={buildScript} disabled={scriptLoading}>
              {scriptLoading
                ? <><span className={s.spinner} /> Calling Groq AI…</>
                : `📝 Generate ${FRAMEWORKS.find(f => f.id === scriptFw)?.label} script`
              }
            </button>

            <div className={s.scriptHints}>
              <p className={s.hintTitle}>Quick examples — click to fill</p>
              {[
                'login with email and password',
                'add item to cart and checkout',
                'search for a product by name',
                'user registration with validation',
                'bank transfer between accounts',
                'forgot password reset flow',
              ].map(hint => (
                <button key={hint} className={s.hintBtn} onClick={() => setDesc(hint)}>
                  {hint}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Right panel */}
      <div className={s.right} id="test-output">

        {!results && !scriptCode && !isLoading && (
          <div className={s.empty}>
            <div className={s.emptyIcon}>
              {tab === 'manual' ? '📋' : tab === 'auto' ? '⚙️' : '📝'}
            </div>
            <p className={s.emptyTitle}>
              {tab === 'script'
                ? 'Your generated script appears here'
                : 'Results appear here'}
            </p>
            <p className={s.emptySub}>
              {tab === 'script'
                ? 'Type a test scenario like "login test" and click Generate'
                : 'Fill in the form and click Generate'}
            </p>
          </div>
        )}

        {isLoading && (
          <div className={s.empty}>
            <div className={s.loadingDots}><span /><span /><span /></div>
            <p className={s.emptyTitle}>
              {scriptLoading
                ? `Writing ${FRAMEWORKS.find(f => f.id === scriptFw)?.label} script…`
                : 'Calling Groq AI…'}
            </p>
            <p className={s.emptySub}>Usually takes 5–10 seconds</p>
          </div>
        )}

        {/* Script output */}
        {tab === 'script' && scriptCode && !scriptLoading && (
          <div className={s.scriptOutput}>
            <div className={s.scriptHeader}>
              <div>
                <h2 className={s.resultsTitle}>
                  {FRAMEWORKS.find(f => f.id === scriptFw)?.label} script
                </h2>
                <p className={s.resultsMeta}>
                  {scriptCode.split('\n').length} lines · generated for "{desc}"
                </p>
              </div>
              <button
                className={`${s.copyAllBtn} ${scriptCopied ? s.copyAllDone : ''}`}
                onClick={copyScript}
              >
                {scriptCopied ? ' Copied!' : '⎘ Copy all'}
              </button>
            </div>
            <pre className={s.scriptPre}><code>{scriptCode}</code></pre>
            <div className={s.scriptFooter}>
              <p className={s.scriptNote}>
                ✅ Ready to use — copy into your project and update selectors/URLs for your app.
              </p>
              <button className={s.resetBtn} onClick={() => { setScriptCode(''); setDesc('') }}>
                ↺ Generate another
              </button>
            </div>
          </div>
        )}

        {/* Manual results */}
        {tab === 'manual' && results && !loading && (
          <div className={s.results}>
            <div className={s.resultsHeader}>
              <div>
                <h2 className={s.resultsTitle}>{results.testCases?.length} manual test cases</h2>
                <p className={s.resultsMeta}>Coverage score: {results.coverageScore}%</p>
              </div>
              <div className={s.scoreRing}>{results.coverageScore}%</div>
            </div>
            <div className={s.cards}>
              {results.testCases?.map((tc, i) => (
                <TestCaseCard key={tc.id || i} tc={tc} index={i} />
              ))}
            </div>
            <ExportBar testCases={results.testCases} project="My Project" framework="manual" />
          </div>
        )}

        {/* Automation results */}
        {tab === 'auto' && results && !loading && (
          <div className={s.results}>
            <div className={s.resultsHeader}>
              <div>
                <h2 className={s.resultsTitle}>{results.testCases?.length} automation test cases</h2>
                <p className={s.resultsMeta}>{results.framework} · Coverage: {results.coverageScore}%</p>
              </div>
              <div className={s.scoreRing}>{results.coverageScore}%</div>
            </div>
            <div className={s.cards}>
              {results.testCases?.map((tc, i) => (
                <TestCaseCard key={tc.id || i} tc={tc} index={i} />
              ))}
            </div>
            <ExportBar testCases={results.testCases} project="My Project" framework={results.framework} />
          </div>
        )}
      </div>
    </div>
  )
}