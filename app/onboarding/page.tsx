"use client";

import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  CheckCircle2,
  FileUp,
  UploadCloud,
  LockKeyhole,
  ShieldCheck,
  User,
} from "lucide-react";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import "./onboarding.css";
import "./onboarding.premium.css";

const roles = [
  "Student",
  "Researcher",
  "Software Developer",
  "UI/UX Designer",
  "Statistician",
  "Adviser",
  "Other",
];
const categories = [
  "Artificial Intelligence",
  "Machine Learning & Data Science",
  "Natural Language Processing",
  "Computer Vision",
  "Software Engineering",
  "Web Development",
  "Mobile Application Development",
  "Information Systems",
  "Internet of Things (IoT)",
  "Cybersecurity",
  "Cloud Computing & DevOps",
  "Networking",
  "Database Systems",
  "Blockchain & Web3",
  "Human-Computer Interaction (UI/UX)",
  "Embedded Systems",
  "Robotics & Automation",
  "Multimedia, AR/VR & Game Development",
  "Geographic Information Systems (GIS)",
  "Educational Technology (EdTech)",
  "Healthcare Technology (HealthTech)",
  "Financial Technology (FinTech)",
  "Agricultural Technology (AgriTech)",
  "Data Analytics & Business Intelligence",
  "Emerging Technologies",
  "Other (Specify)",
];
const serviceGroups: Record<string, { description: string; items: string[] }> = {
  "Research Package": {
    description: "Research foundation and manuscript structure support.",
    items: [
      "Proposed title",
      "Rationale",
      "Objectives",
      "RRL suggestions",
      "Methodology",
      "Research framework",
      "Scope and limitations",
      "Research questions",
      "Data gathering plan",
      "Citation and reference support",
      "Research consultation sessions",
      "Manuscript structure guidance",
    ],
  },
  "Engineering Package": {
    description: "Technical planning and system design support.",
    items: [
      "Requirements analysis",
      "System architecture",
      "Database schema",
      "UI prototype/wireframe",
      "Development roadmap",
      "Technology stack recommendation",
      "API design",
      "System workflow",
      "Feature breakdown",
      "Technical documentation",
      "System design consultation",
    ],
  },
  "Developer Package": {
    description: "Software engineering support during development. Additional fees may apply for: Full system development, Advanced system modules, AI feature integration, Cloud deployment, External API integration, Database hosting/setup.",
    items: [
      "Starter repository setup",
      "Code assistance",
      "Frontend/backend guidance",
      "Database implementation support",
      "API integration support",
      "Testing checklist",
      "Debugging support",
      "Deployment guide",
      "Code review",
      "Version control setup",
      "Environment configuration",
      "Documentation templates",
      "Maintenance guide",
    ],
  },
  "Defense Package": {
    description: "Final presentation and evaluation preparation.",
    items: [
      "Presentation slides",
      "Possible panel questions",
      "Explanation guides",
      "Defense script",
      "Demo flow preparation",
      "Technical explanation support",
      "Project walkthrough",
      "Defense preparation checklist",
      "Revision assistance",
      "Final manuscript polishing",
      "Mock defense session",
    ],
  },
};
const bundledOffers: Record<
  string,
  { description: string; includes: string[]; items: string[] }
> = {
  "Starter Capstone Package": {
    description:
      "Best for students who already have a project idea and need complete planning support before development.",
    includes: ["Research Package", "Engineering Package", "Defense Package"],
    items: [
      "Proposed title",
      "Rationale",
      "Objectives",
      "RRL suggestions",
      "Methodology",
      "Research framework",
      "Scope and limitations",
      "Research questions",
      "Data gathering plan",
      "Citation and reference support",
      "Research consultation sessions",
      "Manuscript structure guidance",
      "Requirements analysis",
      "System architecture",
      "Database schema",
      "UI prototype/wireframe",
      "Development roadmap",
      "Technology stack recommendation",
      "API design",
      "System workflow",
      "Feature breakdown",
      "Technical documentation",
      "System design consultation",
      "Presentation outline",
      "Possible panel questions",
      "Explanation guide",
      "Defense preparation checklist",
    ],
  },
  "Complete Capstone Package": {
    description:
      "Best for students who need end-to-end support from research planning to final defense preparation.",
    includes: [
      "Research Package",
      "Engineering Package",
      "Developer Package",
      "Defense Package",
    ],
    items: [
      ...serviceGroups["Research Package"].items,
      ...serviceGroups["Engineering Package"].items,
          "Explanation guide",
      ...serviceGroups["Defense Package"].items,
      "Complete project coordination",
      "Development progress monitoring",
      "Integration assistance",
      "Final quality review",
    ],
  },
  "Premium Capstone Partnership": {
    description:
      "Best for student groups, organizations, or clients requiring extensively software development assistance.",
    includes: [
      "Research Package",
      "Engineering Package",
      "Developer Package",
      "Defense Package",
    ],
    items: [
      "Complete research consultation",
      "Full system planning",
      "Custom UI/UX design",
      "Full-stack development assistance",
      "Database implementation",
      "Cloud deployment support",
      "System testing",
      "Documentation preparation",
      "User manual creation",
      "Defense coaching",
      "Post-defense revisions",
      "Priority support",
    ],
  },
};
const addOns = [
  "Additional system modules",
  "AI feature integration",
  "Mobile application development",
  "Cloud deployment setup",
  "Additional revision rounds",
  "Training/tutorial session",
];
const reasons = [
  "Tight deadline",
  "Need technical guidance",
  "First time conducting research",
  "Need software development assistance",
  "Improve research quality",
  "Improve system quality",
  "Defense preparation",
  "Need expert consultation",
];
const packagePrefixes = [
  "Research Package",
  "Engineering Package",
  "Developer Package",
  "Defense Package",
  "Starter Capstone Package",
  "Complete Capstone Package",
  "Premium Capstone Partnership",
];

function toggleItems(
  item: string,
  setter: (items: string[]) => void,
  items: string[]
) {
  setter(items.includes(item) ? items.filter((x) => x !== item) : [...items, item]);
}

function expandServices(services: string[]): string[] {
  const result: string[] = [];
  const seen = new Set<string>();
  for (const s of services) {
    if (!seen.has(s)) {
      result.push(s);
      seen.add(s);
    }
    if (s in bundledOffers) {
      for (const component of bundledOffers[s].includes) {
        if (!seen.has(component)) {
          result.push(component);
          seen.add(component);
        }
      }
    }
  }
  return result;
}

function documentRequirements(
  packages: string[],
  developerStarted: string
) {
  const required = new Set<string>();
  const recommended = new Set<string>();
  const add = (items: string[], destination: Set<string>) =>
    items.forEach((item) => destination.add(item));

  if (packages.includes("Research Package"))
    add(
      [
        "Approved Title Document",
        "Research Proposal",
        "Current Research Manuscript",
        "School Template",
        "Rubrics",
        "Adviser/Panel Comments",
      ],
      required
    );

  if (packages.includes("Engineering Package")) {
    add(
      ["Approved Title Document", "Research Proposal", "Current Research Manuscript", "School Template", "Rubrics"],
      required
    );
    add(
      ["Functional Requirements (if available)", "Existing System Diagrams (if available)"],
      required
    );
    add(
      ["UI Mockups", "Use Case Diagram", "ERD", "DFD", "Flowcharts"],
      recommended
    );
  }

  if (packages.includes("Developer Package")) {
    if (developerStarted === "yes")
      add(
        ["Source Code", "GitHub Repository", "Database", "Existing Documentation", "Figma/UI", "API Documentation (if available)"],
        required
      );
    if (developerStarted === "no") {
      add(["Functional Requirements", "Feature List"], required);
      add(["UI Ideas (optional)", "System Design (if available)"], recommended);
    }
  }

  if (packages.includes("Defense Package")) {
    add(["Latest Manuscript", "Presentation Slides (if available)"], required);
    add(["Adviser/Panel Comments", "Previous Revision Notes (if any)"], recommended);
  }

  return {
    required: [...required],
    recommended: [...recommended].filter((item) => !required.has(item)),
  };
}

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState("Student");
  const [approved, setApproved] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [category, setCategory] = useState("");
  const [teamType, setTeamType] = useState("Individual");
  const [groupAgreed, setGroupAgreed] = useState("");
  const [developerStarted, setDeveloperStarted] = useState("");
  const [services, setServices] = useState<string[]>([]);
  const [selections, setSelections] = useState<string[]>([]);
  const [uploads, setUploads] = useState<string[]>([]);
  const [checks, setChecks] = useState<Record<string, boolean>>({});
  const [profilePic, setProfilePic] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem("beaver_profile_pic");
    if (saved) setProfilePic(saved);
  }, []);

  useEffect(() => {
    if (profilePic) localStorage.setItem("beaver_profile_pic", profilePic);
  }, [profilePic]);

  const expandedServices = useMemo(() => expandServices(services), [services]);
  const hasDeveloper = useMemo(
    () => expandedServices.includes("Developer Package"),
    [expandedServices]
  );
  const requiredDocuments = useMemo(
    () => documentRequirements(expandedServices, developerStarted),
    [expandedServices, developerStarted]
  );
  const selectedBundles = useMemo(
    () => services.filter((s) => s in bundledOffers),
    [services]
  );
  const selectedAddOns = useMemo(
    () => services.filter((s) => addOns.includes(s)),
    [services]
  );
  const selectedPackages = useMemo(
    () =>
      services.filter(
        (s) => s in serviceGroups && !(s in bundledOffers)
      ),
    [services]
  );

  const canContinue = useMemo(() => {
    if (step === 1)
      return Boolean(checks.accurate && checks.identity && checks.agreement);
    if (step === 2)
      return (
        approved === "yes" &&
        projectTitle.trim().length > 3 &&
        category !== ""
      );
    if (step === 3)
      return (
        selectedPackages.length > 0 ||
        selectedBundles.length > 0 ||
        selectedAddOns.length > 0
      );
    if (step === 4)
      return Boolean(
        checks.commitment &&
          (teamType !== "Group" || groupAgreed === "yes")
      );
    if (step === 5)
      return (
        (!hasDeveloper || Boolean(developerStarted)) &&
        requiredDocuments.required.every((file) =>
          uploads.includes(file)
        )
      );
    return Boolean(checks.final);
  }, [
    step,
    checks,
    approved,
    projectTitle,
    category,
    services,
    uploads,
    teamType,
    groupAgreed,
    requiredDocuments,
    developerStarted,
    hasDeveloper,
    selectedPackages,
    selectedBundles,
    selectedAddOns,
  ]);

  const next = () => {
    if (!canContinue) return;
    if (step === 6) {
      setSubmitted(true);
      return;
    }
    setStep(step + 1);
  };
  const prev = () => setStep(Math.max(1, step - 1));

  const stepLabels = [
    "Profile",
    "Project",
    "Services",
    "Commitment",
    "Documents",
    "Review",
  ];
  const stepTitles = [
    "About you",
    "About your project",
    "Services needed",
    "Your commitment",
    "Initial documents",
    "Review your application",
  ];
  const stepDescs = [
    "Confirm the email connected to your BEAVER account.",
    "Tell us about the project you want support with.",
    "Choose packages and the specific support you need.",
    "This helps us prepare the right recommendation.",
    "Upload only the documents needed for your selected packages.",
    "Check the details before your application is sent.",
  ];
  const steps = [
    { component: <AboutYou {...{ role, setRole, checks, setChecks, profilePic, setProfilePic }} /> },
    { component: <AboutProject {...{ approved, setApproved, title: projectTitle, setTitle: setProjectTitle, category, setCategory, teamType, setTeamType }} /> },
    {
      component: (
        <Services
          {...{
            services,
            setServices,
            selections,
            setSelections,
            title: projectTitle,
            category,
          }}
        />
      ),
    },
    { component: <Commitment {...{ checks, setChecks, teamType, groupAgreed, setGroupAgreed }} /> },
    {
      component: (
        <Documents
          {...{
            uploads,
            setUploads,
            requirements: requiredDocuments,
            developerStarted,
            setDeveloperStarted,
            hasDeveloper,
          }}
        />
      ),
    },
    {
      component: (
        <Review
          {...{
            role,
            title: projectTitle,
            category,
            teamType,
            services,
            selections,
            uploads,
            checks,
            profilePic,
            selectedBundles,
            selectedAddOns,
            selectedPackages,
            setStep,
          }}
        />
      ),
    },
  ];

  if (submitted) return <Submitted />;

  return (
    <main className="onboard">
      <aside className="onboard-side">
        <a href="/" className="onboard-brand">
          <span>B</span> BEAVER
        </a>
        <div>
          <p className="side-tag">CLIENT APPLICATION</p>
          <h1>
            A thoughtful start
            <br />
            to meaningful work.
          </h1>
          <p>
            Every application is reviewed carefully, so we can match your
            project with the right support team.
          </p>
        </div>
        <div className="side-security">
          <ShieldCheck size={20} />
          <p>
            <strong>Your information is protected.</strong>{" "}
            Documents are reviewed only by authorized BEAVER administrators.
          </p>
        </div>
      </aside>

      <section className="onboard-main">
        <header>
          <a href="/login">
            <ArrowLeft size={15} /> Exit application
          </a>
          <span>
            Already applied? <a href="/login">Sign in</a>
          </span>
        </header>

        <div className="form-wrap">
          <Progress step={step} />

          <div className="form-title">
            <p>STEP {step} OF 6</p>
            <h2>{stepTitles[step - 1]}</h2>
            <span>{stepDescs[step - 1]}</span>
          </div>

          <div className="form-content">{steps[step - 1].component}</div>

          <div className="form-nav">
            <button
              className="nav-back"
              onClick={prev}
              disabled={step === 1}
            >
              Back
            </button>
            <button
              className="nav-next"
              onClick={next}
              disabled={!canContinue || step === 6}
            >
              {step === 6 ? "Submit application" : "Continue"}
            </button>
          </div>
          {!canContinue && (
            <div className="validation-hints">
              <small>Can't continue — missing:</small>
              <ul>
                {step === 1 && (
                  <>
                    {!checks.accurate && <li>Accuracy certification</li>}
                    {!checks.identity && <li>Identity authorization</li>}
                    {!checks.agreement && <li>Academic integrity acknowledgement</li>}
                  </>
                )}
                {step === 2 && (
                  <>
                    {approved !== 'yes' && <li>Approved title required</li>}
                    {projectTitle.trim().length <= 3 && <li>Project title (min 4 chars)</li>}
                    {!category && <li>Research category</li>}
                  </>
                )}
                {step === 3 && (
                  <>
                    {selectedPackages.length === 0 && selectedBundles.length === 0 && selectedAddOns.length === 0 && <li>Select at least one package, bundle, or add-on</li>}
                  </>
                )}
                {step === 4 && (
                  <>
                    {!checks.commitment && <li>Agree to commitment</li>}
                    {teamType === 'Group' && groupAgreed !== 'yes' && <li>All group members must agree</li>}
                  </>
                )}
                {step === 5 && (
                  <>
                    {hasDeveloper && !developerStarted && <li>Answer: Has development started?</li>}
                    {requiredDocuments.required.some((file) => !uploads.includes(file)) && <li>Upload required documents for selected package(s)</li>}
                  </>
                )}
                {step === 6 && !checks.final && <li>Final acknowledgement</li>}
              </ul>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function Progress({ step }: { step: number }) {
  const labels = ["Profile", "Project", "Services", "Commitment", "Documents", "Review"];
  return (
    <div className="progress-steps">
      {labels.map((label, i) => (
        <div
          className={i + 1 <= step ? "current" : ""}
          key={label}
        >
          <i>{i + 1 < step ? <Check size={12} /> : i + 1}</i>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function Field({
  label,
  type = "text",
  placeholder,
  optional = false,
}: {
  label: string;
  type?: string;
  placeholder?: string;
  optional?: boolean;
}) {
  return (
    <label className="field">
      {label}
      {optional && <em>Optional</em>}
      <input type={type} placeholder={placeholder} />
    </label>
  );
}

function AboutYou({
  role,
  setRole,
  checks,
  setChecks,
  profilePic,
  setProfilePic,
}: any) {
  const [email, setEmail] = useState("");
  const [fullName, setFullName] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("beaver_user_email");
      if (stored) setEmail(stored);
      const storedName = localStorage.getItem("beaver_user_name");
      if (storedName) setFullName(storedName);
    } catch (e) {
      // ignore
    }
  }, []);
  const handleProfilePicChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev: any) => {
      setProfilePic(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <>
      <div className="fields">
        <div className="field profile-field">
          <label className="profile-upload-inline">
            <div className="profile-inline">
              {profilePic ? (
                <img src={profilePic} alt="Profile" className="profile-thumb" />
              ) : (
                <div className="profile-thumb-placeholder">
                  <User size={16} />
                </div>
              )}
              <span className="pic-overlay">
                <Camera size={12} />
              </span>
            </div>
            <input
              id="profile-pic-input"
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={{ display: "none" }}
            />
          </label>
          <label>
            Full legal name
            <input
              type="text"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                try {
                  localStorage.setItem('beaver_user_name', e.target.value);
                } catch (err) {}
              }}
              placeholder="Your full legal name"
            />
          </label>
          <label>
            Email address
            <input
              type="email"
              value={email}
              readOnly
              disabled
              aria-readonly
            />
            <small className="email-helper">This email is linked to your BEAVER account and cannot be changed.</small>
          </label>
        </div>
        <p className="account-note">
          Your account profile details are pulled from signup. We only need the
          account email here to associate this application correctly.
        </p>
      </div>

      <h3>Your role for this application</h3>
      <div className="choice-grid roles">
        {roles.map((item) => (
          <button
            key={item}
            className={role === item ? "chosen" : ""}
            onClick={() => setRole(item)}
          >
            {role === item && <Check size={13} />} {item}
          </button>
        ))}
      </div>

      {role === "Student" && (
        <>
          <h3>Student verification</h3>
          <div className="fields two">
            <Field label="School / university" />
            <Field label="College / department" />
            <Field label="Course" />
            <Field label="Year level" />
            <Field label="Student number" optional />
          </div>
          <p className="upload-title">
            Verification documents{" "}
            <span>Required: school ID or registration form</span>
          </p>
          <div className="upload-row">
            <UploadButton label="School ID (front)" />
            <UploadButton label="School ID (back) or registration form" />
            <UploadButton label="Proof of enrollment" optional />
          </div>
        </>
      )}

      <CheckLine
        text="I certify that the information provided is accurate."
        name="accurate"
        checks={checks}
        setChecks={setChecks}
      />
      <CheckLine
        text="I authorize BEAVER to verify the information and documents provided."
        name="identity"
        checks={checks}
        setChecks={setChecks}
      />
      <CheckLine
        text="I understand that BEAVER provides ethical mentoring and technical support, and I remain responsible for complying with my institution's academic policies."
        name="agreement"
        checks={checks}
        setChecks={setChecks}
      />
    </>
  );
}

function AboutProject({
  approved,
  setApproved,
  title,
  setTitle,
  category,
  setCategory,
  teamType,
  setTeamType,
}: any) {
  return (
    <>
      <div className="fields">
        <label className="field">
          Project title
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter your approved research or capstone title"
          />
        </label>
        <label className="field">
          Research category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">Choose a category</option>
            {categories.map((x) => (
              <option key={x}>{x}</option>
            ))}
          </select>
        </label>
        <label className="field">
          Project description <em>100–500 words</em>
          <textarea
            placeholder="Briefly describe the problem, intended users, and desired outcome."
          />
        </label>
      </div>

      <h3>Has your project title been officially approved?</h3>
      <div className="approval-buttons">
        <button
          onClick={() => setApproved("yes")}
          className={approved === "yes" ? "chosen" : ""}
        >
          Yes, it has been approved
        </button>
        <button
          onClick={() => setApproved("no")}
          className={approved === "no" ? "chosen" : ""}
        >
          No, not yet
        </button>
      </div>
      {approved === "no" && (
        <div className="warning">
          <AlertTriangle size={19} />
          <div>
            <strong>An approved title is required.</strong>
            <p>
              BEAVER accepts only officially approved research or capstone
              projects so our support aligns with your institution's direction.
              Please return once your title has been approved.
            </p>
          </div>
        </div>
      )}

      <h3>Team information</h3>
      <div className="fields two">
        <label className="field">
          Project setup
          <select
            value={teamType}
            onChange={(e) => setTeamType(e.target.value)}
          >
            <option>Individual</option>
            <option>Group</option>
          </select>
        </label>
        <Field label="Expected completion date" type="date" />
      </div>
    </>
  );
}

function Services({
  services,
  setServices,
  selections,
  setSelections,
  title,
  category,
}: any) {
  const toggleBundle = (bundleName: string) => {
    if (services.includes(bundleName)) {
      setServices(services.filter((s) => s !== bundleName));
    } else {
      setServices([...services, bundleName]);
    }
  };

  return (
    <>
      <h3>Core packages</h3>
      {Object.entries(serviceGroups).map(([name, group]) => (
        <section className="service-section" key={name}>
          <button
            className={
              "service-toggle " +
              (services.includes(name) ? "chosen" : "")
            }
            onClick={() =>
              toggleItems(name, setServices, services)
            }
          >
            <i>
              {services.includes(name) && <Check size={13} />}
            </i>
            <span>{name}</span>
            <small>Select package</small>
          </button>
          {services.includes(name) && (
            <div className="service-options">
              <p>
                {group.description} About <strong>{title || "your project"}</strong>
                {category && (
                  <> under <strong>{category}</strong></>
                )}
              </p>
              <div>
                {group.items.map((item) => (
                  <button
                    onClick={() =>
                      toggleItems(
                        name + item,
                        setSelections,
                        selections
                      )
                    }
                    className={
                      selections.includes(name + item) ? "picked" : ""
                    }
                    key={item}
                  >
                    <i>
                      {selections.includes(name + item) && (
                        <Check size={12} />
                      )}
                    </i>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      ))}

      <h3>Bundled offers</h3>
      {Object.entries(bundledOffers).map(([name, offer]) => (
        <section className="service-section bundle-section" key={name}>
          <button
            className={
              "service-toggle " +
              (services.includes(name) ? "chosen bundle-active" : "")
            }
            onClick={() => toggleBundle(name)}
          >
            <i>
              {services.includes(name) && <Check size={13} />}
            </i>
            <span>{name}</span>
            <small>Bundle</small>
          </button>
          {services.includes(name) && (
            <div className="service-options">
              <p>{offer.description}</p>
              <p className="bundle-includes">
                Includes all items from:{" "}
                {offer.includes.join(" + ")}
              </p>
              <div className="bundle-items">
                {offer.items.map((item) => (
                  <button
                    className="picked"
                    key={item}
                    onClick={(e) => e.preventDefault()}
                  >
                    <i>
                      <Check size={12} />
                    </i>
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </section>
      ))}

      <h3>Optional add-ons</h3>
      <div className="choice-grid addons">
        {addOns.map((item) => (
          <button
            key={item}
            className={services.includes(item) ? "picked" : ""}
            onClick={() =>
              toggleItems(item, setServices, services)
            }
          >
            <i>
              {services.includes(item) && <Check size={12} />}
            </i>
            {item}
          </button>
        ))}
      </div>
    </>
  );
}

function Commitment({ checks, setChecks, teamType, groupAgreed, setGroupAgreed }: any) {
  return (
    <>
      <div className="fields two">
        <label className="field">
          Estimated budget
          <select>
            <option value="">Choose a range</option>
            <option>Below ₱5,000</option>
            <option>₱5,000–₱10,000</option>
            <option>₱10,000–₱20,000</option>
            <option>₱20,000+</option>
          </select>
        </label>
        <label className="field">
          Payment decision maker
          <select>
            <option value="">Choose one</option>
            <option>Myself</option>
            <option>Group leader</option>
            <option>Parent / guardian</option>
            <option>Organization</option>
            <option>Other</option>
          </select>
        </label>
        {teamType === "Group" && (
          <label className="field group-required">
            Have all group members agreed to avail this service?
            <select
              value={groupAgreed}
              onChange={(e) => setGroupAgreed(e.target.value)}
            >
              <option value="">Choose one</option>
              <option value="yes">Yes, all members agreed</option>
              <option value="no">No, not yet</option>
            </select>
            <small>
              If Group, all members must agree before this request can
              proceed. The application will not continue without unanimous
              group consent.
            </small>
          </label>
        )}
        <label className="field">
          Have you discussed this with your adviser?
          <select>
            <option value="">Choose one</option>
            <option>Yes</option>
            <option>Not yet</option>
          </select>
        </label>
      </div>

      <h3>Why are you seeking assistance?</h3>
      <div className="reason-grid">
        {reasons.map((item) => (
          <button
            className={checks[item] ? "picked" : ""}
            onClick={() =>
              setChecks({ ...checks, [item]: !checks[item] })
            }
            key={item}
          >
            <i>{checks[item] && <Check size={12} />}</i>
            {item}
          </button>
        ))}
      </div>

      <label className="field">
        Tell us more <em>Optional</em>
        <textarea
          placeholder="Anything else our review team should know?"
        />
      </label>

      <CheckLine
        text="I understand that an approved quotation may require a consultation and that a verified initial payment is required before a project workspace is created."
        name="commitment"
        checks={checks}
        setChecks={setChecks}
      />
    </>
  );
}

function Documents({
  uploads,
  setUploads,
  requirements,
  developerStarted,
  setDeveloperStarted,
  hasDeveloper,
}: any) {
  const files = [...requirements.required, ...requirements.recommended];

  return (
    <>
      <div className="document-notice">
        <LockKeyhole size={18} />
        <p>
          <strong>Checklist based on your selected package(s).</strong>{" "}
          Required files must be added before review. Recommended files help us
          create a better proposal.
        </p>
      </div>

      {hasDeveloper && (
        <div className="developer-progress">
          <strong>Has software development already started?</strong>
          <div className="approval-buttons">
            <button
              className={developerStarted === "yes" ? "chosen" : ""}
              onClick={() => setDeveloperStarted("yes")}
            >
              Yes
            </button>
            <button
              className={developerStarted === "no" ? "chosen" : ""}
              onClick={() => setDeveloperStarted("no")}
            >
              No
            </button>
          </div>
        </div>
      )}

      <div className="document-list">
        {files.map((file: string) => (
          <button
            className={uploads.includes(file) ? "uploaded" : ""}
            key={file}
            onClick={() =>
              toggleItems(file, setUploads, uploads)
            }
          >
            <span className="doc-icon">
              {uploads.includes(file) ? (
                <CheckCircle2 size={19} />
              ) : (
                <FileUp size={19} />
              )}
            </span>
            <div>
              <strong>{file}</strong>
              <small>
                {requirements.required.includes(file)
                  ? "Required"
                  : "Recommended"}
              </small>
            </div>
            <span>
              {uploads.includes(file) ? "Added" : "Upload"}
            </span>
          </button>
        ))}
      </div>

      <p className="privacy-note">
        By uploading, you confirm you have permission to share these files with
        BEAVER for evaluation and service delivery.
      </p>
    </>
  );
}

function Review({
  role,
  title,
  category,
  teamType,
  services,
  selections,
  uploads,
  checks,
  profilePic,
  selectedBundles,
  selectedAddOns,
  selectedPackages,
  setStep,
}: any) {
  const [email, setEmail] = useState("");
  useEffect(() => {
    try {
      const stored = localStorage.getItem("beaver_user_email");
      if (stored) setEmail(stored);
    } catch (e) {
      // ignore
    }
  }, []);
  const [fullNameDisplay, setFullNameDisplay] = useState("");
  useEffect(() => {
    try {
      const n = localStorage.getItem('beaver_user_name');
      if (n) setFullNameDisplay(n);
    } catch (e) {}
  }, []);
  const selectedItems = selections.map((item: string) =>
    item.replace(
      new RegExp(
        "^(" +
          packagePrefixes.join("|") +
          ")"
      ),
      ""
    )
  );

  return (
    <>
      <div className="review-card">
        <h3>
          Account & verification
          <button className="edit-link" onClick={() => setStep(1)}>Edit</button>
        </h3>
        <div className="review-profile">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="review-avatar" />
          ) : (
            <div className="review-avatar-placeholder">
              <User size={14} />
            </div>
          )}
          <p>
            Role: <strong>{role}</strong>
          </p>
          <p>
            Full name: <strong>{fullNameDisplay || "Not provided"}</strong>
          </p>
          <p>
            Email: <strong>{email || "Not available"}</strong>
          </p>
        </div>
        <p>
          Identity verification, accuracy certification, and academic-integrity
          acknowledgement: <strong>Accepted</strong>
        </p>
      </div>

      <div className="review-card">
        <h3>
          Project information
          <button className="edit-link" onClick={() => setStep(2)}>Edit</button>
        </h3>
        <p>
          <strong>{title || "Project title pending"}</strong>
        </p>
        <p>
          {category || "Category pending"} · {teamType}
        </p>
      </div>

      <div className="review-card">
        <h3>
          Packages & services requested
          <button className="edit-link" onClick={() => setStep(3)}>Edit</button>
        </h3>
        {selectedPackages.length > 0 && (
          <p>
            <strong>
              Core packages:{" "}
              {selectedPackages.join(" · ")}
            </strong>
          </p>
        )}
        {selectedBundles.length > 0 && (
          <p>
            <strong>
              Bundled offers:{" "}
              {selectedBundles.join(" · ")}
            </strong>
          </p>
        )}
        {selectedAddOns.length > 0 && (
          <p>
            <strong>
              Add-ons:{" "}
              {selectedAddOns.join(" · ")}
            </strong>
          </p>
        )}
        {selectedPackages.length === 0 &&
          selectedBundles.length === 0 &&
          selectedAddOns.length === 0 && (
          <p>No packages selected</p>
        )}
        {selectedItems.length > 0 && (
          <p className="review-items">
            Selected inclusions:{" "}
            {selectedItems.join(" · ")}
          </p>
        )}
      </div>

      <div className="review-card">
        <h3>
          Initial documents
          <button className="edit-link" onClick={() => setStep(5)}>Edit</button>
        </h3>
        <p>
          {uploads.length} document
          {uploads.length === 1 ? "" : "s"} selected for upload
        </p>
      </div>

      <div className="review-card cost">
        <h3>What happens next</h3>
        <p>
          Application review → project assessment → service proposal → client
          confirmation → initial payment → workspace activation. A dedicated
          workspace is created only after your quotation is accepted, the
          agreement is signed, and payment is verified.
        </p>
      </div>

      <CheckLine
        text="I understand that submitting an application does not guarantee acceptance, a quotation, or workspace access."
        name="final"
        checks={checks}
        setChecks={setChecks}
      />
    </>
  );
}

function UploadButton({
  label,
  optional,
}: {
  label: string;
  optional?: boolean;
}) {
  const [name, setName] = useState("");
  return (
    <label className="small-upload">
      <UploadCloud size={18} />
      <span>{name || label}</span>
      <small>{optional ? "Optional" : "Upload file"}</small>
      <input
        type="file"
        onChange={(e: ChangeEvent<HTMLInputElement>) =>
          setName(e.target.files?.[0]?.name || "")
        }
      />
    </label>
  );
}

function CheckLine({ text, name, checks, setChecks }: any) {
  return (
    <label className="check-line">
      <input
        type="checkbox"
        checked={Boolean(checks[name])}
        onChange={() =>
          setChecks({ ...checks, [name]: !checks[name] })
        }
      />
      <i>{checks[name] && <Check size={13} />}</i>
      <span>{text}</span>
    </label>
  );
}

function Submitted() {
  return (
    <main className="submitted">
      <a href="/" className="onboard-brand">
        <span>B</span> BEAVER
      </a>
      <section>
        <div className="success-icon">
          <Check size={34} />
        </div>
        <p className="side-tag">APPLICATION RECEIVED</p>
        <h1>
          Request submitted
          <br />
          successfully.
        </h1>
        <p>
          Thank you for choosing BEAVER. Our team will review your profile,
          verify your documents, and evaluate your project requirements.
        </p>

        <div className="application-status">
          <div className="status-heading">
            <span>STATUS</span>
            <strong>Waiting for review</strong>
          </div>

          {[
            [
              "Request submitted",
              "We've received your application.",
              "complete",
            ],
            [
              "Application review",
              "We verify your information and submitted documents.",
              "",
            ],
            [
              "Project assessment",
              "Our specialists evaluate your research, technical requirements, and project scope.",
              "",
            ],
            [
              "Service proposal",
              "We prepare your quotation, timeline, and recommended service plan.",
              "",
            ],
            [
              "Client confirmation",
              "Review and accept the quotation and service agreement.",
              "",
            ],
            [
              "Initial payment",
              "Secure your project by completing the required initial payment.",
              "",
            ],
            [
              "Workspace activation",
              "Your BEAVER workspace is created, and your dedicated team is assigned.",
              "",
            ],
          ].map(([name, description, state]: any) => (
            <div className={state} key={name}>
              <i>{state ? <Check size={12} /> : ""}</i>
              <span>
                <strong>{name}</strong>
                <small>{description}</small>
              </span>
              {state && <em>Today</em>}
            </div>
          ))}
        </div>

        <div className="next-info">
          <ShieldCheck size={18} />
          <p>
            <strong>No workspace has been created yet.</strong> Workspace access
            is granted only after identity and project verification, accepted
            quotation, signed agreement, and verified initial payment.
          </p>
        </div>

        <div className="submitted-buttons">
          <a href="/">Return home</a>
          <a className="primary" href="/login">
            View request status <ArrowRight size={15} />
          </a>
        </div>
      </section>
    </main>
  );
}
