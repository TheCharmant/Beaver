"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, CircleHelp, Code2, FileText, Layers3, Menu, Sparkles } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import emailjs from "@emailjs/browser";
import "./contact.css";

const packages = [
  {
    icon: FileText,
    title: "Research",
    price: "₱3,000 — ₱6,000+",
    description:
      "Designed for students who need assistance in developing and structuring their research foundation.",
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
      "Citation & reference support",
      "Research consultation sessions",
      "Manuscript structure guidance"
    ]
  },
  {
    icon: Layers3,
    title: "Engineering",
    price: "₱5,000 — ₱10,000+",
    description:
      "Designed for students who need technical planning and system design support.",
    items: [
      "Requirements analysis",
      "System architecture",
      "Database schema",
      "UI prototype / wireframe",
      "Development roadmap",
      "Technology stack recommendation",
      "API design",
      "System workflow",
      "Feature breakdown",
      "Technical documentation",
      "System design consultation"
    ]
  },
  {
    icon: Code2,
    title: "Developer",
    price: "₱10,000 — ₱30,000+",
    description:
      "Designed for students who need software engineering assistance during development.",
    items: [
      "Starter repository setup",
      "Code assistance",
      "Frontend / backend guidance",
      "Database implementation support",
      "API integration support",
      "Testing checklist",
      "Debugging support",
      "Deployment guide",
      "Code review",
      "Version control setup",
      "Environment configuration",
      "Documentation templates",
      "Maintenance guide"
    ]
  }
];

const faqs = [
  ["Who do you work with?", "We support students and student groups working on academic research, capstones, and software-based projects."],
  ["Can I get support for only one part of my project?", "Absolutely. You can choose a focused package or add-on based on the support you need right now."],
  ["How is pricing determined?", "Final pricing depends on your scope, timeline, complexity, and the level of hands-on assistance required."],
  ["Do you offer consultations before I commit?", "Yes. Start with a quick project conversation so we can recommend the clearest path forward."]
];

const inquirySchema = z.object({ name: z.string().min(2, "Please enter your name"), email: z.string().email("Enter a valid email"), message: z.string().min(10, "Tell us a little more about your project") });
type Inquiry = z.infer<typeof inquirySchema>;

export default function Home() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Inquiry>({ resolver: zodResolver(inquirySchema) });
  const submitInquiry = async (values: Inquiry) => {
    setSubmitError("");
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const notifyTemplateId = process.env.NEXT_PUBLIC_EMAILJS_NOTIFY_TEMPLATE;
    const replyTemplateId = process.env.NEXT_PUBLIC_EMAILJS_REPLY_TEMPLATE;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

    if (!serviceId || !notifyTemplateId || !replyTemplateId || !publicKey) {
      setSubmitError("Email delivery has not been configured yet.");
      return;
    }

    try {
      const templateParams = {
        name: values.name,
        email: values.email,
        message: values.message,
      };

      await emailjs.send(serviceId, notifyTemplateId, templateParams, { publicKey });
      await emailjs.send(serviceId, replyTemplateId, templateParams, { publicKey });
      setSent(true);
    } catch (error) {
      console.error("EmailJS contact email failed", error);
      setSubmitError("Failed to send your message. Please try again.");
    }
  };
  return <main>
    <nav className="nav"><a href="#top" className="brand"><span className="brand-mark">B</span><span>BEAVER</span></a><div className="nav-links"><a href="#packages">Packages</a><a href="#process">How it works</a><a href="#faq">FAQ</a></div><a href="#contact" className="nav-cta">Let&apos;s talk <ArrowRight size={15}/></a><button className="menu" aria-label="Open menu"><Menu /></button></nav>
    <section className="hero" id="top">
      <div className="hero-glow" />
      <motion.p initial={{opacity:0,y:12}} animate={{opacity:1,y:0}} className="eyebrow"><Sparkles size={14}/> BE A VERsion of Success.</motion.p>
      <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{delay:.1}}>Build with clarity.<br/><em>Defend with confidence.</em></motion.h1>
      <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:.2}} className="hero-copy">We help students transform ideas into high-quality research and software through expert mentoring, software deengineering support, technical consultation, documentation guidance, and defense preparation.</motion.p>
      <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} transition={{delay:.3}} className="hero-actions"><a href="#contact" className="button button-primary">Start your project <ArrowRight size={17}/></a><a href="#packages" className="text-link">Explore packages <ArrowRight size={16}/></a></motion.div>
      <div className="hero-note"><span></span> Trusted support for every stage of your academic journey <span></span></div>
    </section>
    <section className="intro"><p className="section-tag">WHAT WE DO</p><h2>From a rough idea to a polished final defense.</h2><p>We pair research rigor with practical engineering experience. The result? Structured projects that feel purposeful, polished, and ready for evaluation.</p><div className="stats"><div><strong>4</strong><span>core areas of support</span></div><div><strong>1:1</strong><span>project-focused guidance</span></div><div><strong>∞</strong><span>ideas worth building</span></div></div></section>
    <section className="packages" id="packages"><div className="section-head"><div><p className="section-tag">PACKAGE OFFERS</p><h2>Support that meets you<br/>where you are.</h2></div><p>Choose the expertise your project needs, exactly when it needs it.</p></div><div className="package-grid">{packages.map((pkg, i) => <motion.article initial={{opacity:0,y:24}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*.08}} key={pkg.title} className="package-card"><div className="card-icon"><pkg.icon size={22}/></div><h3>{pkg.title} Package</h3><p className="price">{pkg.price}</p><p className="card-description">{pkg.description}</p><ul>{pkg.items.map(item=><li key={item}><Check size={15}/>{item}</li>)}</ul><a href="#contact">View inclusions <ArrowRight size={16}/></a></motion.article>)}</div></section>
    <section className="bundle"><div className="bundle-content"><p className="section-tag">BUNDLED OFFERS</p><h2>A complete partner<br/>for your capstone.</h2><p>For teams who want continuity from the very first research question all the way to the final presentation.</p><a href="#contact" className="button button-dark">Find your package <ArrowRight size={17}/></a></div><div className="bundle-list"><div><span>01</span><div><h3>Starter Capstone</h3><p>Research + Engineering + Basic Defense Preparation</p></div><strong>₱7k–₱12k</strong></div><div><span>02</span><div><h3>Complete Capstone</h3><p>Research + Engineering + Software Development + Defense Preparation</p></div><strong>₱20k–₱40k+</strong></div><div><span>03</span><div><h3>Premium Partnership</h3><p>Research + Engineering + Software Development + Defense Preparation + Unlimited Revisions + Priority Support + Post-Defense Support</p></div><strong>₱50k+</strong></div></div></section>
    <section className="process" id="process"><p className="section-tag">A SIMPLE PROCESS</p><h2>Less guessing. More building.</h2><div className="process-grid">{[["01","Tell us your vision","Share your idea, requirements, and where you need a hand."],["02","Get a clear plan","We scope the work and recommend the support that fits."],["03","Build with momentum","Move forward with a focused partner by your side."]].map(s=><div key={s[0]}><span>{s[0]}</span><h3>{s[1]}</h3><p>{s[2]}</p></div>)}</div></section>
<section className="defense">

  <div className="defense-symbol">
    <CircleHelp size={64}/>
  </div>

  <div>

    <p className="section-tag">
      DEFENSE PACKAGE · ₱2,500 — ₱5,000
    </p>

    <h2>
      Present with confidence.
      <br />
      Defend with clarity.
    </h2>

    <p>
      Designed for students preparing for their final thesis or capstone defense.
      We help you organize your presentation, strengthen your technical explanations,
      anticipate panel questions, and confidently demonstrate your system.
    </p>

    <ul className="defense-list">
      <li><Check size={14}/> Presentation slide review & improvement</li>
      <li><Check size={14}/> Possible panel questions</li>
      <li><Check size={14}/> Technical explanation guide</li>
      <li><Check size={14}/> Defense script preparation</li>
      <li><Check size={14}/> System demo flow planning</li>
      <li><Check size={14}/> Project walkthrough coaching</li>
      <li><Check size={14}/> Manuscript polishing</li>
      <li><Check size={14}/> Revision recommendations</li>
      <li><Check size={14}/> Mock defense session</li>
      <li><Check size={14}/> Defense preparation checklist</li>
    </ul>

    <p className="defense-note">
      <strong>Optional support:</strong> Additional mock defense sessions,
      presentation redesign, extended revisions, and post-panel revisions
      are available upon request.
    </p>

    <a href="#contact" className="text-link">
      Prepare for defense
      <ArrowRight size={16}/>
    </a>

  </div>

</section>
    <section className="faq" id="faq"><div><p className="section-tag">QUESTIONS, ANSWERED</p><h2>Good work starts<br/>with a good conversation.</h2></div><div className="faq-list">{faqs.map(([q,a],i)=><button key={q} onClick={()=>setOpenFaq(openFaq===i?null:i)} className={openFaq===i?"faq-item open":"faq-item"}><div><span>{q}</span><ChevronDown size={18}/></div>{openFaq===i&&<p>{a}</p>}</button>)}</div></section>
    <section className="contact" id="contact"><p className="section-tag">START HERE</p><h2>Make your next project<br/><em>your best work.</em></h2><p>Tell us what you&apos;re building. We&apos;ll help you map the way forward.</p>{sent ? <p className="success">Thank you — your message has been sent. We&apos;ll be in touch soon. Please check your spam folder if you don&apos;t see our confirmation email.</p> : <form onSubmit={handleSubmit(submitInquiry)} className="inquiry-form"><div><input aria-label="Your name" placeholder="Your name" {...register("name")}/>{errors.name && <small>{errors.name.message}</small>}</div><div><input aria-label="Email address" placeholder="Email address" type="email" {...register("email")}/>{errors.email && <small>{errors.email.message}</small>}</div><div className="message-field"><textarea aria-label="Message" placeholder="Tell us about your project" rows={3} {...register("message")}/>{errors.message && <small>{errors.message.message}</small>}</div><button className="button button-primary" type="submit" disabled={isSubmitting}>{isSubmitting ? "Sending..." : <>Submit <ArrowRight size={17}/></>}</button>{submitError && <small className="submit-error">{submitError}</small>}</form>}</section>
    <footer><a className="brand" href="#top"><span className="brand-mark">B</span><span>BEAVER</span></a><p>Student Research & Software Development Support</p><span>© 2026 BeaverSolutions</span></footer>
  </main>;
}
