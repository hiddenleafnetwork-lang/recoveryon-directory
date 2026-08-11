/**
 * RecoveryOn Directory - Shared Data Model
 * Exposes categories, states, and demo resources.
 */

window.RECOVERY_CATEGORIES = [
    { 
        name: "Treatment Centers", 
        icon: "fa-house-medical", 
        slug: "treatment-centers", 
        countText: "0 centers",
        intro: "Inpatient and residential rehabilitation centers offering medical supervision, detoxification, and structured group therapy programs.",
        seoText: "Choosing the right treatment center is a critical step in the recovery journey. These facilities provide round-the-clock clinical care, structured therapy formats, and stable environments to support long-term recovery goals. When browsing treatment centers, verify the specific levels of care offered, such as residential rehabilitation, partial hospitalization (PHP), or medical detox programs.",
        faqs: [
            { q: "What is a residential treatment center?", a: "Residential treatment centers are live-in facilities where patients receive structured, supervised care for substance use or mental health conditions, separating them from external triggers." },
            { q: "How long does treatment center placement typically last?", a: "Placement durations vary depending on clinical needs, with standard programs ranging from 30 days to 90 days or longer for extended care." },
            { q: "Do treatment centers accept insurance?", a: "Many private insurance plans cover a portion of residential treatment. It is recommended to contact the center's admissions office to verify your coverage." }
        ]
    },
    { 
        name: "Counseling & Therapy", 
        icon: "fa-user-doctor", 
        slug: "counseling-therapy", 
        countText: "0 therapists",
        intro: "Licensed psychologists, counselors, and psychotherapists providing individual, group, or family counseling sessions.",
        seoText: "Therapeutic interventions help individuals uncover the root causes of addictive behaviors and develop healthier coping mechanisms. Licensed therapists utilize evidence-based modalities like Cognitive Behavioral Therapy (CBT), Dialectical Behavior Therapy (DBT), and trauma-informed counseling to help clients build long-term resilience.",
        faqs: [
            { q: "What is CBT (Cognitive Behavioral Therapy)?", a: "CBT is a goal-oriented talk therapy that helps individuals identify and change negative thought patterns and behaviors contributing to substance use or anxiety." },
            { q: "What should I expect in my first therapy session?", a: "The first session, often called an intake session, involves discussing your background, current challenges, goals, and developing a preliminary treatment plan." },
            { q: "Are virtual telehealth sessions effective?", a: "Yes, studies show that online video therapy is highly effective for individual counseling, providing convenient access without travel constraints." }
        ]
    },
    { 
        name: "Detox Programs", 
        icon: "fa-droplet", 
        slug: "detox-programs", 
        countText: "0 programs",
        intro: "Clinically monitored detoxification services designed to safely manage physical withdrawal symptoms from substances.",
        seoText: "Detox programs provide the medical oversight necessary to cleanse substances from the body safely. Because withdrawal can be physically dangerous, professional detox clinics offer 24/7 medication management and emotional support to ensure client comfort and safety before transitioning to therapeutic rehabilitation.",
        faqs: [
            { q: "Why is medical detox important?", a: "Medical detox ensures safety by providing clinical supervision and medications to prevent severe or life-threatening withdrawal symptoms." },
            { q: "Is detox the same as treatment?", a: "No. Detox cleanses the body of toxins and manages physical dependence, whereas treatment addresses the underlying psychological and behavioral causes of addiction." },
            { q: "How long does detox take?", a: "A typical detox program lasts between 3 to 10 days, depending on the substance, duration of use, and individual health factors." }
        ]
    },
    { 
        name: "Support Groups", 
        icon: "fa-users", 
        slug: "support-groups", 
        countText: "0 groups",
        intro: "Community-driven peer recovery groups including 12-step programs, SMART Recovery, and family support circles.",
        seoText: "Peer-led support groups offer a strong sense of community and shared experiences. Engaging with peers who are also on the recovery path reduces isolation and provides mutual accountability in a safe, non-clinical environment.",
        faqs: [
            { q: "Are support groups free to attend?", a: "Most community peer support groups, like Alcoholics Anonymous (AA) or SMART Recovery, are free and run on voluntary donations." },
            { q: "What is the difference between AA and SMART Recovery?", a: "AA is a spiritually grounded 12-step program focusing on surrender to a higher power. SMART Recovery is a secular program focusing on cognitive-behavioral tools and self-empowerment." },
            { q: "Can family members attend peer groups?", a: "Yes, specialized groups like Al-Anon or Nar-Anon are dedicated to supporting family members and loved ones of individuals in recovery." }
        ]
    },
    { 
        name: "Sober Living", 
        icon: "fa-bed", 
        slug: "sober-living", 
        countText: "0 homes",
        intro: "Structured, substance-free transitional housing designed to support individuals re-entering independent living.",
        seoText: "Sober living homes bridge the gap between intensive rehabilitation and return to daily life. Residents live in a supportive community, adhere to house rules (such as curfews and drug testing), and practice real-world recovery skills in a structured setting.",
        faqs: [
            { q: "What are the rules in a sober living home?", a: "Standard rules include maintaining sobriety, participating in regular drug screenings, respecting curfews, attending house meetings, and contributing to chores." },
            { q: "How long do people live in sober housing?", a: "Most residents stay between 3 to 12 months, although some homes allow longer placements based on individual transition progress." },
            { q: "Do sober homes provide clinical treatment?", a: "Generally no. Sober living homes offer drug-free housing and peer support, but residents usually attend outpatient therapy or meetings off-site." }
        ]
    },
    { 
        name: "Mental Health Services", 
        icon: "fa-brain", 
        slug: "mental-health", 
        countText: "0 services",
        intro: "Comprehensive outpatient psychiatry, dual-diagnosis management, and mental wellness programs.",
        seoText: "Addressing co-occurring mental health disorders (such as depression, anxiety, or PTSD) alongside addiction is crucial for sustainable recovery. Integrated mental health services provide dual-diagnosis care, blending psychiatric medication management with psychotherapeutic support.",
        faqs: [
            { q: "What is a dual diagnosis?", a: "A dual diagnosis occurs when an individual experiences both a mental health condition (like depression or anxiety) and a substance use disorder simultaneously." },
            { q: "Why is treating co-occurring disorders together important?", a: "Treating both conditions simultaneously is essential because untreated mental health issues can trigger relapse, and active substance use can worsen psychiatric symptoms." },
            { q: "What is the role of a psychiatrist in recovery?", a: "Psychiatrists are medical doctors who diagnose mental health conditions and can prescribe medications to manage psychiatric symptoms or reduce cravings." }
        ]
    },
    { 
        name: "Outpatient Treatment", 
        icon: "fa-door-open", 
        slug: "outpatient", 
        countText: "0 clinics",
        intro: "Flexible treatment programs, including Intensive Outpatient (IOP) and outpatient therapy, allowing clients to live at home.",
        seoText: "Outpatient clinics provide intensive clinical therapy without requiring overnight stays. This structure is ideal for individuals transitioning from residential care or those whose work and family commitments require flexible recovery options.",
        faqs: [
            { q: "What is an Intensive Outpatient Program (IOP)?", a: "IOPs are structured outpatient programs that typically require 9 to 20 hours of therapy per week, split across multiple group sessions and individual counseling.",
              q: "Can I work while attending outpatient treatment?", a: "Yes, many outpatient clinics offer evening or morning sessions specifically designed to accommodate school or work schedules." },
            { q: "What is a Partial Hospitalization Program (PHP)?", a: "PHP is a highly intensive day program requiring 5 to 6 hours of clinical care daily, 5 days a week, while allowing patients to return home in the evenings." }
        ]
    },
    { 
        name: "Holistic Wellness", 
        icon: "fa-leaf", 
        slug: "holistic-wellness", 
        countText: "0 centers",
        intro: "Complementary wellness practices including yoga, meditation, acupuncture, sound healing, and nutritional counseling.",
        seoText: "Integrating holistic wellness practices supports physical recovery and mental centering. Techniques such as mindfulness meditation, yoga, acupuncture, and sound therapy are often combined with traditional clinical treatments to reduce stress and improve overall emotional well-being.",
        faqs: [
            { q: "How does yoga support addiction recovery?", a: "Yoga combines physical postures with breathwork, helping individuals release physical tension, reduce anxiety, and reconnect with their bodies." },
            { q: "What is sound healing?", a: "Sound healing utilizes vibrational frequencies from instruments like singing bowls or gongs to induce deep relaxation and reduce neurological stress levels." },
            { q: "Are holistic wellness services covered by clinical insurance?", a: "Coverage varies. Some insurance providers cover acupuncture or nutritional counseling when integrated into a clinical treatment plan. Check with the provider for details." }
        ]
    }
];

window.RECOVERY_STATES = [
    { 
        name: "Alabama", abbr: "AL", count: 0,
        intro: "Find local recovery resources, support groups, and clinical counseling services across the state of Alabama.",
        cities: ["Birmingham", "Montgomery", "Mobile", "Huntsville", "Tuscaloosa"]
    },
    { 
        name: "Alaska", abbr: "AK", count: 0,
        intro: "Discover substance use treatment resources, inpatient centers, and support networks across Alaska.",
        cities: ["Anchorage", "Fairbanks", "Juneau", "Sitka", "Ketchikan"]
    },
    { 
        name: "Arizona", abbr: "AZ", count: 0,
        intro: "Locate treatment centers, sobriety housing, and outpatient support groups in Arizona.",
        cities: ["Phoenix", "Tucson", "Mesa", "Chandler", "Scottsdale"]
    },
    { 
        name: "Arkansas", abbr: "AR", count: 0,
        intro: "Browse recovery services, counselors, and community groups across Arkansas.",
        cities: ["Little Rock", "Fort Smith", "Fayetteville", "Springdale", "Jonesboro"]
    },
    { 
        name: "California", abbr: "CA", count: 0,
        intro: "Access leading detox facilities, outpatient clinics, therapists, and sober living environments in California.",
        cities: ["Los Angeles", "San Diego", "San Jose", "San Francisco", "Sacramento", "La Jolla"]
    },
    { 
        name: "Colorado", abbr: "CO", count: 0,
        intro: "Find holistic clinics, counselors, and inpatient treatment options throughout Colorado.",
        cities: ["Denver", "Colorado Springs", "Aurora", "Fort Collins", "Boulder"]
    },
    { 
        name: "Connecticut", abbr: "CT", count: 0,
        intro: "Locate professional recovery networks, therapists, and detox clinics in Connecticut.",
        cities: ["Bridgeport", "New Haven", "Hartford", "Stamford", "Waterbury"]
    },
    { 
        name: "Delaware", abbr: "DE", count: 0,
        intro: "Browse outpatient support, counseling, and transitional living facilities across Delaware.",
        cities: ["Wilmington", "Dover", "Newark", "Middletown", "Milford"]
    },
    { 
        name: "District of Columbia", abbr: "DC", count: 0,
        intro: "Access community support groups, outpatient programs, and mental health assistance in Washington DC.",
        cities: ["Washington"]
    },
    { 
        name: "Florida", abbr: "FL", count: 0,
        intro: "Explore leading rehabilitation centers, sober living transitional houses, and therapists in Florida.",
        cities: ["Jacksonville", "Miami", "Tampa", "Orlando", "St. Petersburg"]
    },
    { 
        name: "Georgia", abbr: "GA", count: 0,
        intro: "Browse local treatment centers, peer support programs, and mental health clinics in Georgia.",
        cities: ["Atlanta", "Augusta", "Columbus", "Savannah", "Athens"]
    },
    { 
        name: "Hawaii", abbr: "HI", count: 0,
        intro: "Locate outpatient programs, detox services, and wellness therapists across Hawaii.",
        cities: ["Honolulu", "Hilo", "Kailua", "Kapolei", "Kahului"]
    },
    { 
        name: "Idaho", abbr: "ID", count: 0,
        intro: "Explore counseling, sober homes, and local support circles in Idaho.",
        cities: ["Boise", "Meridian", "Nampa", "Idaho Falls", "Caldwell"]
    },
    { 
        name: "Illinois", abbr: "IL", count: 0,
        intro: "Browse substance use services, dual-diagnosis clinics, and local counselors in Illinois.",
        cities: ["Chicago", "Aurora", "Naperville", "Joliet", "Rockford"]
    },
    { 
        name: "Indiana", abbr: "IN", count: 0,
        intro: "Find clinical recovery resources, therapists, and sober environments in Indiana.",
        cities: ["Indianapolis", "Fort Wayne", "Evansville", "South Bend", "Carmel"]
    },
    { 
        name: "Iowa", abbr: "IA", count: 0,
        intro: "Locate outpatient therapy and support groups across Iowa.",
        cities: ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City", "Iowa City"]
    },
    { 
        name: "Kansas", abbr: "KS", count: 0,
        intro: "Explore addiction counselors, support networks, and detox clinics in Kansas.",
        cities: ["Wichita", "Overland Park", "Kansas City", "Olathe", "Topeka"]
    },
    { 
        name: "Kentucky", abbr: "KY", count: 0,
        intro: "Browse peer-led groups, inpatient treatment, and sober living in Kentucky.",
        cities: ["Louisville", "Lexington", "Bowling Green", "Owensboro", "Covington"]
    },
    { 
        name: "Louisiana", abbr: "LA", count: 0,
        intro: "Find local recovery help, counselors, and support environments in Louisiana.",
        cities: ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette", "Lake Charles"]
    },
    { 
        name: "Maine", abbr: "ME", count: 0,
        intro: "Discover transitional housing, counselors, and detox clinics in Maine.",
        cities: ["Portland", "Lewiston", "Bangor", "South Portland", "Auburn"]
    },
    { 
        name: "Maryland", abbr: "MD", count: 0,
        intro: "Explore verified recovery services, clinics, and support networks across Maryland.",
        cities: ["Baltimore", "Columbia", "Germantown", "Silver Spring", "Waldorf"]
    },
    { 
        name: "Massachusetts", abbr: "MA", count: 0,
        intro: "Find leading rehabilitation facilities, outpatient treatment, and support circles in Massachusetts.",
        cities: ["Boston", "Worcester", "Springfield", "Cambridge", "Lowell"]
    },
    { 
        name: "Michigan", abbr: "MI", count: 0,
        intro: "Browse detox resources, dual-diagnosis treatment, and sober homes in Michigan.",
        cities: ["Detroit", "Grand Rapids", "Warren", "Sterling Heights", "Ann Arbor"]
    },
    { 
        name: "Minnesota", abbr: "MN", count: 0,
        intro: "Access counseling, inpatient centers, and peer support networks throughout Minnesota.",
        cities: ["Minneapolis", "St. Paul", "Rochester", "Duluth", "Bloomington"]
    },
    { 
        name: "Mississippi", abbr: "MS", count: 0,
        intro: "Locate outpatient therapy and support groups across Mississippi.",
        cities: ["Jackson", "Gulfport", "Southaven", "Biloxi", "Hattiesburg"]
    },
    { 
        name: "Missouri", abbr: "MO", count: 0,
        intro: "Explore addiction recovery resources, counseling, and sober living in Missouri.",
        cities: ["Kansas City", "St. Louis", "Springfield", "Columbia", "Independence"]
    },
    { 
        name: "Montana", abbr: "MT", count: 0,
        intro: "Find recovery support, counselors, and community clinics in Montana.",
        cities: ["Billings", "Missoula", "Great Falls", "Bozeman", "Butte"]
    },
    { 
        name: "Nebraska", abbr: "NE", count: 0,
        intro: "Browse outpatient recovery networks and counseling services in Nebraska.",
        cities: ["Omaha", "Lincoln", "Bellevue", "Grand Island", "Kearney"]
    },
    { 
        name: "Nevada", abbr: "NV", count: 0,
        intro: "Access detox clinics, sober transitional housing, and local therapists in Nevada.",
        cities: ["Las Vegas", "Henderson", "Reno", "North Las Vegas", "Sparks"]
    },
    { 
        name: "New Jersey", abbr: "NJ", count: 0,
        intro: "Find substance use clinics, psychiatric services, and peer groups across New Jersey.",
        cities: ["Newark", "Jersey City", "Paterson", "Elizabeth", "Clifton"]
    },
    { 
        name: "New Mexico", abbr: "NM", count: 0,
        intro: "Locate outpatient therapy and support groups in New Mexico.",
        cities: ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe", "Roswell"]
    },
    { 
        name: "New York", abbr: "NY", count: 0,
        intro: "Access leading rehabilitation centers, therapists, and peer support groups in New York.",
        cities: ["New York", "Buffalo", "Rochester", "Yonkers", "Syracuse"]
    },
    { 
        name: "North Carolina", abbr: "NC", count: 0,
        intro: "Browse clinical treatment, sober living, and outpatient support in North Carolina.",
        cities: ["Charlotte", "Raleigh", "Greensboro", "Durham", "Winston-Salem"]
    },
    { 
        name: "Oregon", abbr: "OR", count: 0,
        intro: "Explore local outpatient treatment, counseling, and peer recovery circles in Oregon.",
        cities: ["Portland", "Eugene", "Salem", "Gresham", "Hillsboro"]
    },
    { 
        name: "Texas", abbr: "TX", count: 0,
        intro: "Explore premier treatment clinics, sober homes, and support fellowships in Texas.",
        cities: ["Houston", "San Antonio", "Dallas", "Austin", "Fort Worth"]
    },
    { 
        name: "Washington", abbr: "WA", count: 0,
        intro: "Find clinical counselors, outpatient clinics, and support networks across Washington state.",
        cities: ["Seattle", "Spokane", "Tacoma", "Vancouver", "Bellevue"]
    }
];

window.RECOVERY_RESOURCES = [
    {
        name: "Serene Path Wellness Center",
        slug: "serene-path-wellness",
        category: "Holistic Clinic",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
        statusText: "Verified Center",
        state: "CO",
        county: "Boulder County",
        city: "Boulder",
        area: "Front Range",
        address: "123 Serene Way, Boulder, CO 80301",
        latitude: 40.0150,
        longitude: -105.2705,
        categories: ["Holistic Wellness", "Counseling & Therapy"],
        treatmentTypes: ["Acupuncture", "Yoga Therapy", "Meditation", "Sound Healing"],
        rating: 4.9,
        reviewCount: 34,
        insuranceAccepted: ["Blue Cross Blue Shield", "Aetna", "UnitedHealthcare"],
        logo: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=150&h=150&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80"
        ],
        phone: "+1 (303) 555-0199",
        email: "contact@serenepath.org",
        website: "https://example.com/serene-path",
        aboutShort: "A holistic clinic offering yoga, sound healing, and acupuncture in Boulder.",
        aboutLong: "Serene Path Wellness Center provides a calm, supportive environment where individuals can engage in alternative recovery therapies. Our clinic features certified instructors and clinical practitioners who specialize in integrating physical movement with emotional healing. All services listed for this facility are part of a demonstration dataset for testing layout components.",
        services: ["Sound baths", "Group meditation", "Acupuncture", "Private yoga classes"],
        amenities: ["Outdoor Zen garden", "Herbal tea station", "Private therapy rooms"],
        status: "Demo Data / Testing Only",
        reviews: [
            {
                author: "Somporn Sonthiporn",
                verified: true,
                avatar: "",
                timeText: "4 months ago on Google",
                rating: 5,
                text: "I recently had the opportunity to visit Serene Path Wellness Center in Boulder, and I came away incredibly impressed by the care-oriented staff. They provide a safe, nurturing environment for holistic healing.",
                link: "#"
            },
            {
                author: "Tok Kung (Tok)",
                verified: true,
                avatar: "",
                timeText: "4 months ago on Google",
                rating: 5,
                text: "The Serene Path wellness programs truly take exceptional care of their clients. They provide a safe space and structured routines that make a huge difference in long-term wellness.",
                link: "#"
            },
            {
                author: "Fern A.J.",
                verified: true,
                avatar: "",
                timeText: "5 months ago on Google",
                rating: 5,
                text: "I have a close association with Serene Path and its management and staff. I can vouch for their dedication, integrity, and clinical excellence. Highly recommended!",
                link: "#"
            },
            {
                author: "Thanachai Amathapr...",
                verified: true,
                avatar: "",
                timeText: "5 months ago on Google",
                rating: 5,
                text: "Serene Path is an extremely effective wellness center. Their clinical staff are very supportive and help clients build healthy, sustainable habits.",
                link: "#"
            },
            {
                author: "Cecilia Chan",
                verified: true,
                avatar: "",
                timeText: "6 months ago on Google",
                rating: 5,
                text: "This center has provided all rounded and customer services to our family. The staff went above and beyond to support my daughter through her wellness program.",
                link: "#"
            },
            {
                author: "Alvin LinThant",
                verified: true,
                avatar: "",
                timeText: "6 months ago on Google",
                rating: 5,
                text: "Serene Path is a great place for clients looking for a stable environment for their recovery. The meditation and yoga classes are top notch.",
                link: "#"
            }
        ]
    },
    {
        name: "Hope & Unity Fellowship",
        slug: "hope-unity-fellowship",
        category: "Support Group",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
        statusText: "Free Consultations",
        state: "TX",
        county: "Travis County",
        city: "Austin",
        area: "Downtown Austin",
        address: "704 Congress Ave, Austin, TX 78701",
        latitude: 30.2701,
        longitude: -97.7418,
        categories: ["Support Groups"],
        treatmentTypes: ["12-Step Groups", "Peer Support", "Family Counseling"],
        rating: 4.8,
        reviewCount: 19,
        insuranceAccepted: [],
        logo: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=150&h=150&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1521791136368-1a983b75a907?auto=format&fit=crop&w=600&q=80"
        ],
        phone: "+1 (512) 555-0144",
        email: "info@hopeandunity.org",
        website: "https://example.com/hope-unity",
        aboutShort: "A supportive peer recovery group providing group discussions and meetings in Austin.",
        aboutLong: "Hope & Unity Fellowship is dedicated to providing community-driven support for individuals recovering from substance use disorders. We host weekly peer group discussions, family sessions, and sober socials. All listed details are sample data for layout design validation.",
        services: ["12-Step facilitation", "Weekly support circles", "Sober social gatherings", "Family education programs"],
        amenities: ["Spacious meeting hall", "Coffee bar", "Children play room"],
        status: "Demo Data / Testing Only",
        reviews: [
            {
                author: "Fern A.J.",
                verified: true,
                avatar: "",
                timeText: "4 months ago on Google",
                rating: 5,
                text: "Hope & Unity Fellowship is a life-changing group. The peer support here is absolutely genuine and has helped me tremendously on my personal path.",
                link: "#"
            },
            {
                author: "Tok Kung (Tok)",
                verified: true,
                avatar: "",
                timeText: "5 months ago on Google",
                rating: 5,
                text: "Fantastic support circles. Everyone is welcoming and the facilitators create a secure, judgment-free zone.",
                link: "#"
            },
            {
                author: "Somporn Sonthiporn",
                verified: true,
                avatar: "",
                timeText: "5 months ago on Google",
                rating: 5,
                text: "Highly recommend Hope & Unity for family counseling. They really helped us heal together.",
                link: "#"
            }
        ]
    },
    {
        name: "Apex Therapy Associates",
        slug: "apex-therapy-associates",
        category: "Counseling",
        image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
        statusText: "Insurance Accepted",
        state: "NY",
        county: "New York County",
        city: "New York",
        area: "Manhattan",
        address: "350 Fifth Ave, New York, NY 10118",
        latitude: 40.7484,
        longitude: -73.9857,
        categories: ["Counseling & Therapy"],
        treatmentTypes: ["CBT", "DBT", "Individual Therapy", "Psychotherapy"],
        rating: 5.0,
        reviewCount: 42,
        insuranceAccepted: ["Aetna", "Cigna", "Empire Blue Cross"],
        logo: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=150&h=150&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1527689368864-3a821dbccc34?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80"
        ],
        phone: "+1 (212) 555-0178",
        email: "appointments@apextherapy.net",
        website: "https://example.com/apex-therapy",
        aboutShort: "Professional counseling and psychotherapy clinic based in Manhattan.",
        aboutLong: "Apex Therapy Associates offers evidence-based cognitive behavioral therapy (CBT) and dialectical behavior therapy (DBT) sessions. Our certified therapists specialize in trauma, anxiety, and addiction recovery, helping clients build sustainable coping mechanisms. All elements shown represent mock layout structures.",
        services: ["Cognitive Behavioral Therapy", "Psychodynamic Therapy", "Trauma-Informed Counseling", "Stress Management"],
        amenities: ["Quiet consultation suites", "Virtual telehealth option", "ADA accessible offices"],
        status: "Demo Data / Testing Only",
        reviews: [
            {
                author: "Alvin LinThant",
                verified: true,
                avatar: "",
                timeText: "2 months ago on Google",
                rating: 5,
                text: "Apex Therapy is top-tier. My sessions here have been incredibly helpful. The therapist is professional, insightful, and empathetic.",
                link: "#"
            },
            {
                author: "Cecilia Chan",
                verified: true,
                avatar: "",
                timeText: "3 months ago on Google",
                rating: 5,
                text: "Clean, comfortable offices and an excellent online scheduling portal. Telehealth options make it very convenient.",
                link: "#"
            },
            {
                author: "Fern A.J.",
                verified: true,
                avatar: "",
                timeText: "4 months ago on Google",
                rating: 5,
                text: "Highly recommended for individual CBT counseling. Truly professional support.",
                link: "#"
            }
        ]
    },
    {
        name: "Elysian Recovery Spa & Retreat",
        slug: "elysian-recovery-retreat",
        category: "Treatment Center",
        image: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=600&q=80",
        statusText: "Starting at $150/day",
        state: "CA",
        county: "San Diego County",
        city: "San Diego",
        area: "La Jolla",
        address: "7922 La Jolla Shores Dr, La Jolla, CA 92037",
        latitude: 32.8532,
        longitude: -117.2558,
        categories: ["Treatment Centers", "Holistic Wellness"],
        treatmentTypes: ["Residential Treatment", "Inpatient Rehab", "Medication Management"],
        rating: 4.7,
        reviewCount: 28,
        insuranceAccepted: ["Anthem Blue Cross", "Cigna", "Aetna", "Humana"],
        logo: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=150&h=150&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
            "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80"
        ],
        phone: "+1 (858) 555-0150",
        email: "admissions@elysianretreat.com",
        website: "https://example.com/elysian-retreat",
        aboutShort: "A luxurious residential rehabilitation and wellness retreat in La Jolla.",
        aboutLong: "Elysian Recovery Spa & Retreat provides premium residential recovery programs combining clinical care with wellness therapies. Clients receive personalized recovery plans, gourmet meals, and access to therapeutic massage and spa amenities. All information listed is placeholder data for developer validation.",
        services: ["Medical detoxification", "Individual psychotherapy", "Family recovery workshops", "Relapse prevention training"],
        amenities: ["Oceanview rooms", "Full-service spa & pool", "Private chef & organic dining", "Fitness studio"],
        status: "Demo Data / Testing Only",
        reviews: [
            {
                author: "Somporn Sonthiporn",
                verified: true,
                avatar: "",
                timeText: "4 months ago on Google",
                rating: 5,
                text: "Elysian Retreat is a beautiful, peaceful sanctuary. The ocean views and gourmet dining combined with top-tier recovery care make it one-of-a-kind.",
                link: "#"
            },
            {
                author: "Tok Kung (Tok)",
                verified: true,
                avatar: "",
                timeText: "4 months ago on Google",
                rating: 5,
                text: "Incredible wellness spa and residential program. Safe space, professional staff, and therapeutic environments.",
                link: "#"
            },
            {
                author: "Fern A.J.",
                verified: true,
                avatar: "",
                timeText: "5 months ago on Google",
                rating: 5,
                text: "Outstanding commitment to patient recovery. The facility is luxurious and highly effective.",
                link: "#"
            }
        ]
    },
    {
        name: "North Star Counseling Group",
        slug: "north-star-counseling",
        category: "Counseling",
        image: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80",
        statusText: "Verified Center",
        state: "WA",
        county: "King County",
        city: "Seattle",
        area: "Capitol Hill",
        address: "1521 11th Ave, Seattle, WA 98122",
        latitude: 47.6152,
        longitude: -122.3183,
        categories: ["Counseling & Therapy"],
        treatmentTypes: ["Outpatient Therapy", "Family Counseling", "Youth Programs"],
        rating: 4.9,
        reviewCount: 15,
        insuranceAccepted: ["Premera Blue Cross", "Regence BlueShield", "Aetna"],
        logo: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=150&h=150&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80"
        ],
        phone: "+1 (206) 555-0131",
        email: "contact@northstarseattle.com",
        website: "https://example.com/north-star",
        aboutShort: "Certified mental health and addiction counseling located in Seattle.",
        aboutLong: "North Star Counseling Group is dedicated to helping Seattle residents overcome psychological challenges, anxiety, and chemical dependencies. We offer custom sessions for individuals, couples, and adolescents. All elements are structured mock samples.",
        services: ["Teen & adolescent therapy", "Couples counseling", "Addiction coping skills", "Grief and loss support"],
        amenities: ["Comfortable lounge area", "Online therapy portal", "Flexible evening scheduling"],
        status: "Demo Data / Testing Only",
        reviews: [
            {
                author: "Thanachai Amathapr...",
                verified: true,
                avatar: "",
                timeText: "3 months ago on Google",
                rating: 5,
                text: "North Star therapists are warm and highly professional. Helped our family navigate through a tough transitional period.",
                link: "#"
            },
            {
                author: "Cecilia Chan",
                verified: true,
                avatar: "",
                timeText: "4 months ago on Google",
                rating: 5,
                text: "Excellent adolescent counseling. They are very understanding and patient.",
                link: "#"
            }
        ]
    },
    {
        name: "Cascade Recovery Clinic",
        slug: "cascade-recovery-clinic",
        category: "Treatment Center",
        image: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=600&q=80",
        statusText: "Insurance Accepted",
        state: "OR",
        county: "Multnomah County",
        city: "Portland",
        area: "Pearl District",
        address: "930 NW 14th Ave, Portland, OR 97209",
        latitude: 45.5298,
        longitude: -122.6853,
        categories: ["Treatment Centers", "Outpatient Treatment"],
        treatmentTypes: ["Intensive Outpatient Program (IOP)", "Sober Living Support", "Relapse Prevention"],
        rating: 4.6,
        reviewCount: 22,
        insuranceAccepted: ["Providence Health Plan", "Moda Health", "Kaiser Permanente"],
        logo: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=150&h=150&q=80",
        gallery: [
            "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=800&q=80",
            "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80"
        ],
        phone: "+1 (503) 555-0142",
        email: "admissions@cascaderecovery.org",
        website: "https://example.com/cascade-recovery",
        aboutShort: "Intensive outpatient recovery program located in Portland's Pearl District.",
        aboutLong: "Cascade Recovery Clinic offers structured intensive outpatient programs (IOP) that allow clients to maintain their daily routines while receiving top-tier support. Our team emphasizes relational health and relapse prevention skills. All data displayed is mock content for interface design evaluation.",
        services: ["Intensive outpatient groups", "Sober companion coordination", "Medicated-assisted treatment consulting", "Nutrition and wellness guidance"],
        amenities: ["Modern facilities", "Transit-accessible location", "Sober lounge area"],
        status: "Demo Data / Testing Only",
        reviews: [
            {
                author: "Alvin LinThant",
                verified: true,
                avatar: "",
                timeText: "4 months ago on Google",
                rating: 5,
                text: "The intensive outpatient program (IOP) here is very structured and helpful. Made it easy to keep working while getting professional care.",
                link: "#"
            },
            {
                author: "Somporn Sonthiporn",
                verified: true,
                avatar: "",
                timeText: "5 months ago on Google",
                rating: 5,
                text: "Outstanding outpatient services. Portland's Pearl District location is highly transit-accessible and modern.",
                link: "#"
            }
        ]
        ]
    }
];

window.RECOVERY_BLOG_POSTS = [
    {
        title: "Instagram Algorithm 2026: What Actually Works",
        slug: "instagram-algorithm-2026",
        date: "August 11, 2026",
        category: "Creator Tips",
        author: "RenderCut",
        image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=600&q=80",
        excerpt: "Instagram runs 4 separate algorithms in 2026. DM shares are now #1 for Reels. Learn what Adam Mosseri confirmed about ranking signals, Trial Reels, and Watch Time changes.",
        content: `
            <p>Instagram does not run one algorithm. It runs four: one each for the Feed, Reels, Stories, and Explore. Each algorithm weighs signals differently, so a strategy that relies on Reels' DM shares, watch-time, or length ratios will not necessarily win in the Feed (saves, shares, clicks, or completion).</p>
            <p>This matters because most growth advice treats Instagram as a single system. It is not. A creator who understands how each surface ranks content can build a strategy that performs across all four, rather than accidentally optimizing for one while undermining the others.</p>
            <p>This guide covers the verified 2026 ranking signals for each Instagram surface, the major algorithm changes Adam Mosseri confirmed this year, what actually drives reach and engagement, and where captions fit into the system.</p>
            
            <h4 style="margin-top:24px; margin-bottom:12px; font-weight:700; color:var(--text-primary);">Who this guide covers:</h4>
            <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 24px; line-height: 1.6;">
                <li>How each of Instagram's four algorithms works</li>
                <li>The 2026 changes that matter most (DM shares, Trial Reels, Watch Time shift)</li>
                <li>The ranking signals for Reels, Feed, Stories, and Explore</li>
                <li>What Adam Mosseri has publicly confirmed about the 2026 algorithm</li>
                <li>Where captions fit into algorithmic distribution</li>
                <li>Tactics that work on each surface</li>
            </ul>

            <h3 style="margin-top:32px; margin-bottom:16px; font-weight:800; font-size:1.25rem; color:var(--text-primary);">1. The Four Instagram Algorithms in 2026</h3>
            <h4 style="margin-top:16px; margin-bottom:8px; font-weight:700; color:var(--text-primary);">Reels Algorithm</h4>
            <p>Reels is Instagram's primary discovery engine right now. The first two to three seconds determine whether your Reel gets pushed to a broader audience or quickly bracketed.</p>
            
            <h3 style="margin-top:32px; margin-bottom:16px; font-weight:800; font-size:1.25rem; color:var(--text-primary);">3. Ranking Signals by Surface</h3>
            
            <!-- Table Component -->
            <div style="overflow-x: auto; margin-bottom: 24px;">
                <table style="width: 100%; border-collapse: collapse; text-align: left; font-size: 0.88rem; margin: 16px 0;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border-color); background-color: var(--support-bg);">
                            <th style="padding: 12px; font-weight: 700; color: var(--primary-color);">Surface</th>
                            <th style="padding: 12px; font-weight: 700; color: var(--primary-color);">#1 Signal</th>
                            <th style="padding: 12px; font-weight: 700; color: var(--primary-color);">Strong Signals</th>
                            <th style="padding: 12px; font-weight: 700; color: var(--primary-color);">Weak Signals</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 12px; font-weight: 600;">Reels</td>
                            <td style="padding: 12px;">DM shares</td>
                            <td style="padding: 12px;">Watch time, replays, saves</td>
                            <td style="padding: 12px;">Likes, follower count</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 12px; font-weight: 600;">Feed</td>
                            <td style="padding: 12px;">Time spent on post</td>
                            <td style="padding: 12px;">Saves, DM shares, comments</td>
                            <td style="padding: 12px;">Likes</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 12px; font-weight: 600;">Stories</td>
                            <td style="padding: 12px;">Consistent watches and replies</td>
                            <td style="padding: 12px;">DM reactions, taps</td>
                            <td style="padding: 12px;">Followers from Stories</td>
                        </tr>
                        <tr style="border-bottom: 1px solid var(--border-color);">
                            <td style="padding: 12px; font-weight: 600;">Explore</td>
                            <td style="padding: 12px;">Interest graph match</td>
                            <td style="padding: 12px;">Watch time, saves</td>
                            <td style="padding: 12px;">Likes, comments</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3 style="margin-top:32px; margin-bottom:16px; font-weight:800; font-size:1.25rem; color:var(--text-primary);">4. Where Captions Fit Into the Algorithm</h3>
            <p>Captions affect algorithmic distribution through two direct mechanisms.</p>
            <p>First, captions improve watch-time ratio. Captions keep silent viewers engaged longer, directly increasing the watch-time-to-length ratio that drives Reels distribution. Between 60 and 80% of Reels are watched without sound. For that majority, captions are the only way to follow the content. Styled captions in short chunks, highlighted keywords, hook-first first lines increase watch-time more than default auto-generated text.</p>
            <p>Second, Instagram reads caption text for content categorization. Instagram processes spoken words as searchable text. Keyword reinforcement occurs when audio, on-screen caption text, and written caption all mention the same topic, giving Instagram strong signals about what the Reel covers. This categorization determines which audience segments see your Reel in their discovery feed.</p>
            
            <!-- Highlight Box Component -->
            <div style="background-color: var(--support-bg); border-left: 4px solid var(--primary-color); padding: 16px 20px; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; margin: 24px 0;">
                <p style="margin: 0; font-style: italic; font-weight: 500; color: var(--text-primary);">
                    Styled captions are one of the most direct inputs into Instagram's watch-time signal, and one of the fastest to improve. RenderCut handles AI transcription, word-level highlights, and hooks first caption design in under 5 minutes per Reel. <a href="#" style="color: var(--primary-color); font-weight: 700; text-decoration: none;">Try RenderCut free</a> and give the algorithm the signals it needs to distribute your content further.
                </p>
            </div>

            <h3 style="margin-top:32px; margin-bottom:16px; font-weight:800; font-size:1.25rem; color:var(--text-primary);">5. Tactics That Work on Each Surface in 2026</h3>
            <h4 style="margin-top:16px; margin-bottom:8px; font-weight:700; color:var(--text-primary);">For Reels</h4>
            <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 24px; line-height: 1.6;">
                <li><strong>Build shareability into the content design:</strong> Every Reel should contain one moment so useful, funny, surprising, or relatable that a viewer would DM it to a specific friend. If no such moment exists, the content is unlikely to earn DM shares regardless of quality.</li>
                <li><strong>Use Trial Reels for hook testing:</strong> Test three different hook lines for the same content concept as Trial Reels before committing to posting to your followers.</li>
                <li><strong>Keep Reels 15 to 45 seconds for high watch-time ratio:</strong> Longer Reels can work but require stronger retention mechanics throughout.</li>
                <li><strong>Caption every Reel:</strong> Silent viewers are the majority. Styled captions capture their attention and hold it.</li>
                <li><strong>Post within 30 minutes of your peak audience time:</strong> The first hour of engagement quality determines early algorithmic push.</li>
            </ul>

            <h4 style="margin-top:16px; margin-bottom:8px; font-weight:700; color:var(--text-primary);">For Feed</h4>
            <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 24px; line-height: 1.6;">
                <li><strong>Post carousels for saves and time-on-post:</strong> Carousels keep viewers swiping through details, building time-on-post and saves.</li>
            </ul>

            <h3 style="margin-top:32px; margin-bottom:16px; font-weight:800; font-size:1.25rem; color:var(--text-primary);">References</h3>
            <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 24px; line-height: 1.6;">
                <li><a href="#" style="color: var(--primary-color); text-decoration: none;">Blog - Instagram algorithm 2026: four ranking signals that matter. DM shares confirmed as top Reels signal</a></li>
                <li><a href="#" style="color: var(--primary-color); text-decoration: none;">Lates - Instagram algorithm in 2026: Trial Reels, shares as top signal, 3-minute Reels eligible for capture</a></li>
                <li><a href="#" style="color: var(--primary-color); text-decoration: none;">Orange Monkey - Instagram algorithm 2026: Mosseri-confirmed signals, inner circle stories ranking, partition system</a></li>
                <li><a href="#" style="color: var(--primary-color); text-decoration: none;">DataSlayer - Instagram algorithm 2026: five ranking signals Mosseri confirmed. Watch Time shift. Your Algorithm dashboard</a></li>
            </ul>
        `
    },
    {
        title: "How to Increase TikTok Watch Time in 2026",
        slug: "tiktok-watch-time-2026",
        date: "August 10, 2026",
        category: "Creator Tips",
        author: "RenderCut",
        image: "https://images.unsplash.com/photo-1598128558393-70ff21433be0?auto=format&fit=crop&w=600&q=80",
        excerpt: "TikTok watch time in 2026 is measured by completion rate, not seconds. Learn about Qualified Views, the tiered distribution system, and 8 tactics that move the numbers.",
        content: `
            <p>TikTok's algorithm prioritizes watch time completion rates and qualified views above all else in 2026. If users watch your video to completion, TikTok pushes it to the next tier of the For You Page (FYP).</p>
            <p>To increase your watch time, focus on crafting strong visual hooks in the first 2 seconds, maintaining a fast pacing, using dynamic edits, and highlighting key concepts with on-screen text overlays.</p>
            <h3 style="margin-top:32px; margin-bottom:16px; font-weight:800; font-size:1.25rem; color:var(--text-primary);">Key Retention Tactics</h3>
            <ul style="list-style-type: disc; padding-left: 20px; margin-bottom: 24px; line-height: 1.6;">
                <li>Start with a clear payoff promise.</li>
                <li>Remove dead air and pauses.</li>
                <li>Use sound effects and visual transitions every 3-4 seconds.</li>
                <li>Deliver value throughout instead of saving everything for the end.</li>
            </ul>
        `
    },
    {
        title: "Free vs Paid Caption Tools: Is It Worth Paying in 2026?",
        slug: "caption-tools-2026",
        date: "August 7, 2026",
        category: "Creator Tips",
        author: "RenderCut",
        image: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?auto=format&fit=crop&w=600&q=80",
        excerpt: "Free caption tools cost more than zero when you factor in watermarks, TOS risks, volume limits, and missing templates. Here's when free is enough and when paying makes sense.",
        content: `
            <p>While free tools are appealing, they often come with hidden costs like watermarks, lower transcription accuracy, and limited styling options. In 2026, premium tools offer advanced AI-driven features like automatic B-roll insertion, sound design integration, and dynamic eye-tracking corrections.</p>
            <p>If you're a casual creator, free tools like CapCut or browser extensions are often enough. However, if you edit professionally or manage multiple channels, investing in a tool like RenderCut or Submagic will save hours of manual typing and dramatically boost viewer retention.</p>
        `
    },
    {
        title: "RenderCut vs Submagic: Which AI Caption Tool Is Better in 2026?",
        slug: "rendercut-vs-submagic",
        date: "August 1, 2026",
        category: "Creator Tips",
        author: "RenderCut",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
        excerpt: "RenderCut vs Submagic compared on pricing, caption quality, automation, and user reviews. See which tool fits for captions vs full video editing in 2026.",
        content: `
            <p>In this detailed comparison, we look at RenderCut and Submagic side-by-side. While Submagic excels in basic short-form caption styling, RenderCut provides a comprehensive video editing studio with custom templates, multi-language support, and B-roll automation capabilities.</p>
            <p>Choose RenderCut if you want a complete workflow solution, and choose Submagic if you want a quick tool dedicated exclusively to short captions.</p>
        `
    },
    {
        title: "Navigating Your Wellness Journey",
        slug: "navigating-wellness-journey",
        date: "July 28, 2026",
        category: "Wellness",
        author: "RecoveryOn Team",
        image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
        excerpt: "Explore insights, tips, stories, and expert advice on your journey to recovery and wellness.",
        content: `
            <p>Entering recovery is a powerful milestone, but maintaining balance requires consistent attention to physical, emotional, and social health. This guide offers helpful tips to help you build positive daily habits, find supportive therapy options, and practice mindfulness.</p>
            <p>Make sure to establish a clean schedule, set boundaries, and engage in local support networks to sustain your long-term success.</p>
        `
    },
    {
        title: "5 Steps to Mental Resilience",
        slug: "five-steps-mental-resilience",
        date: "July 20, 2026",
        category: "Recovery Guide",
        author: "RecoveryOn Team",
        image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
        excerpt: "Discover 5 simple, actionable steps to build mental resilience, manage stress, and support daily emotional health.",
        content: `
            <p>Mental resilience isn't something you're born with; it is built through daily practice. In times of transition, developing positive coping mechanisms is critical for mental wellness.</p>
            <p>Follow these 5 proven steps: 1) Practice active gratitude, 2) Focus on what you can control, 3) Establish micro-goals, 4) Reframe negative self-talk, and 5) Reach out to your support network whenever things get heavy.</p>
        `
    },
    {
        title: "Building Strong Support Systems",
        slug: "building-support-systems",
        date: "July 15, 2026",
        category: "Community",
        author: "RecoveryOn Team",
        image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=600&q=80",
        excerpt: "Building a supportive community is vital for recovery. Learn practical tips on finding local support groups and sober sponsors.",
        content: `
            <p>Isolation is one of the biggest challenges in recovery. Having a group of friends, peers, and professionals who understand your goals makes a world of difference.</p>
            <p>Whether you find this support through 12-step groups, outpatient programs, or wellness circles, establishing reliable lines of communication is crucial for sustaining sobriety.</p>
        `
    }
];

