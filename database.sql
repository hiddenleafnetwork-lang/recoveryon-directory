-- RecoveryOn Directory Database Schema & Migrations
-- Target Database: PostgreSQL / Supabase

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================================================
-- 1. Locations Schema
-- =========================================================================

CREATE TABLE IF NOT EXISTS states (
    code VARCHAR(2) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    intro TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS counties (
    id SERIAL PRIMARY KEY,
    state_code VARCHAR(2) REFERENCES states(code) ON DELETE CASCADE NOT NULL,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (state_code, name)
);

CREATE TABLE IF NOT EXISTS cities (
    id SERIAL PRIMARY KEY,
    state_code VARCHAR(2) REFERENCES states(code) ON DELETE CASCADE NOT NULL,
    county_id INTEGER REFERENCES counties(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (state_code, name)
);

-- =========================================================================
-- 2. Taxonomy Schema
-- =========================================================================

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    icon VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    intro TEXT,
    seo_text TEXT,
    display_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS taxonomy_terms (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'treatment_type', 'level_of_care', 'condition', 'therapy', 'amenity', 'insurance_provider', 'accreditation', 'clientele', 'special_program'
    name VARCHAR(150) NOT NULL,
    slug VARCHAR(150) NOT NULL,
    display_order INTEGER DEFAULT 0 NOT NULL,
    is_active BOOLEAN DEFAULT true NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE (type, name)
);

-- =========================================================================
-- 3. Resources Schema
-- =========================================================================

CREATE TABLE IF NOT EXISTS resources (
    id SERIAL PRIMARY KEY,
    source_id VARCHAR(100) UNIQUE, -- External identifier/Source ID
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(50) DEFAULT 'Imported' NOT NULL, -- 'Imported', 'Needs Review', 'Draft', 'Published', 'Archived'
    verification_status VARCHAR(100) DEFAULT 'Demo Data' NOT NULL, -- Public status e.g., 'Verified Center' or 'Demo Data'
    
    -- Description
    about_short TEXT,
    about_long TEXT,
    
    -- Contact
    phone VARCHAR(50),
    email VARCHAR(150),
    website TEXT,
    google_business_url TEXT,
    
    -- Physical Location
    address VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(150) NOT NULL,
    county VARCHAR(150),
    state VARCHAR(2) REFERENCES states(code) NOT NULL,
    zip VARCHAR(20),
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    
    -- Ratings & Metadata
    rating NUMERIC(3,2) DEFAULT 0.00 NOT NULL,
    review_count INTEGER DEFAULT 0 NOT NULL,
    google_rating NUMERIC(3,2),
    google_review_count INTEGER,
    
    -- Media
    logo TEXT,
    featured_image TEXT,
    gallery TEXT[] DEFAULT '{}'::text[] NOT NULL,
    image_alt_text VARCHAR(255),
    
    -- Insurance & Finance
    insurance_accepted TEXT[] DEFAULT '{}'::text[] NOT NULL,
    payment_options TEXT[] DEFAULT '{}'::text[] NOT NULL,
    private_pay BOOLEAN DEFAULT true NOT NULL,
    financing_info TEXT,
    
    -- Program Details
    founded_year INTEGER,
    bed_count INTEGER,
    accreditation TEXT[] DEFAULT '{}'::text[] NOT NULL,
    licensing TEXT,
    program_length VARCHAR(100),
    
    -- SEO Metadata
    seo_title VARCHAR(255),
    meta_description TEXT,
    canonical_slug VARCHAR(255),
    index_noindex BOOLEAN DEFAULT true NOT NULL,
    structured_data JSONB,
    
    last_imported_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Resource Taxonomy Mapping Tables
CREATE TABLE IF NOT EXISTS resource_categories (
    resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
    category_id INTEGER REFERENCES categories(id) ON DELETE CASCADE,
    PRIMARY KEY (resource_id, category_id)
);

CREATE TABLE IF NOT EXISTS resource_taxonomy (
    resource_id INTEGER REFERENCES resources(id) ON DELETE CASCADE,
    term_id INTEGER REFERENCES taxonomy_terms(id) ON DELETE CASCADE,
    PRIMARY KEY (resource_id, term_id)
);

-- =========================================================================
-- 4. Import / Rollback Log System
-- =========================================================================

CREATE TABLE IF NOT EXISTS import_batches (
    id SERIAL PRIMARY KEY,
    file_name VARCHAR(255) NOT NULL,
    uploaded_by VARCHAR(255) NOT NULL, -- Email address of admin
    row_count INTEGER DEFAULT 0 NOT NULL,
    new_count INTEGER DEFAULT 0 NOT NULL,
    updated_count INTEGER DEFAULT 0 NOT NULL,
    skipped_count INTEGER DEFAULT 0 NOT NULL,
    failed_count INTEGER DEFAULT 0 NOT NULL,
    status VARCHAR(50) DEFAULT 'Pending' NOT NULL, -- 'Pending', 'Processing', 'Completed', 'Failed', 'Rolled Back'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE IF NOT EXISTS import_logs (
    id SERIAL PRIMARY KEY,
    batch_id INTEGER REFERENCES import_batches(id) ON DELETE CASCADE NOT NULL,
    row_number INTEGER NOT NULL,
    resource_name VARCHAR(255),
    status VARCHAR(50) NOT NULL, -- 'Success', 'Warning', 'Failed'
    message TEXT,
    imported_resource_id INTEGER REFERENCES resources(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =========================================================================
-- 5. Database Indexes
-- =========================================================================

CREATE INDEX IF NOT EXISTS idx_resources_slug ON resources(slug);
CREATE INDEX IF NOT EXISTS idx_resources_status ON resources(status);
CREATE INDEX IF NOT EXISTS idx_resources_state_city ON resources(state, city);
CREATE INDEX IF NOT EXISTS idx_resources_source_id ON resources(source_id);
CREATE INDEX IF NOT EXISTS idx_taxonomy_terms_type ON taxonomy_terms(type);
CREATE INDEX IF NOT EXISTS idx_import_logs_batch ON import_logs(batch_id);

-- =========================================================================
-- 6. Updated At Trigger Function
-- =========================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_resources_updated_at
    BEFORE UPDATE ON resources
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =========================================================================
-- 7. Row Level Security (RLS) Policies
-- =========================================================================

-- Enable RLS
ALTER TABLE states ENABLE ROW LEVEL SECURITY;
ALTER TABLE counties ENABLE ROW LEVEL SECURITY;
ALTER TABLE cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE taxonomy_terms ENABLE ROW LEVEL SECURITY;
ALTER TABLE resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE resource_taxonomy ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE import_logs ENABLE ROW LEVEL SECURITY;

-- 7.1 States Policies
CREATE POLICY select_states ON states FOR SELECT USING (true);
CREATE POLICY all_states ON states FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7.2 Counties Policies
CREATE POLICY select_counties ON counties FOR SELECT USING (true);
CREATE POLICY all_counties ON counties FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7.3 Cities Policies
CREATE POLICY select_cities ON cities FOR SELECT USING (true);
CREATE POLICY all_cities ON cities FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7.4 Categories Policies
CREATE POLICY select_categories ON categories FOR SELECT USING (true);
CREATE POLICY all_categories ON categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7.5 Taxonomy Terms Policies
CREATE POLICY select_taxonomy_terms ON taxonomy_terms FOR SELECT USING (true);
CREATE POLICY all_taxonomy_terms ON taxonomy_terms FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7.6 Resources Policies
CREATE POLICY select_resources ON resources FOR SELECT USING (status = 'Published' OR auth.role() = 'authenticated');
CREATE POLICY all_resources ON resources FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7.7 Mapping Tables Policies
CREATE POLICY select_resource_categories ON resource_categories FOR SELECT USING (true);
CREATE POLICY all_resource_categories ON resource_categories FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY select_resource_taxonomy ON resource_taxonomy FOR SELECT USING (true);
CREATE POLICY all_resource_taxonomy ON resource_taxonomy FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- 7.8 Import Logs Policies
CREATE POLICY all_import_batches ON import_batches FOR ALL TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY all_import_logs ON import_logs FOR ALL TO authenticated USING (true) WITH CHECK (true);


-- =========================================================================
-- 8. Seed Data
-- =========================================================================

-- Seed Categories
INSERT INTO categories (name, icon, slug, intro, seo_text, display_order) VALUES
('Treatment Centers', 'fa-house-medical', 'treatment-centers', 'Inpatient and residential rehabilitation centers offering medical supervision, detoxification, and structured group therapy programs.', 'Choosing the right treatment center is a critical step in the recovery journey. These facilities provide round-the-clock clinical care, structured therapy formats, and stable environments to support long-term recovery goals. When browsing treatment centers, verify the specific levels of care offered, such as residential rehabilitation, partial hospitalization (PHP), or medical detox programs.', 1),
('Detox Programs', 'fa-droplet', 'detox-programs', 'Supervised medical detoxification services providing safe management of withdrawal symptoms under professional clinical monitoring.', 'Medical detoxification is often the essential first phase of recovering from physical dependence. Under 24/7 clinical supervision, patients receive medications and support to ease withdrawal symptoms safely. Selecting a structured detox program reduces clinical risks and establishes a stable transition into counseling and rehab.', 2),
('Outpatient Treatment', 'fa-hospital-user', 'outpatient-treatment', 'Flexible clinical recovery schedules including Intensive Outpatient Programs (IOP) and Partial Hospitalization (PHP) allowing clients to live at home.', 'Outpatient treatment programs offer intensive clinical therapy without requiring a residential stay. This supports individuals transitioning from inpatient care or those maintaining work and family commitments. Outpatient options range from high-structure Partial Hospitalization Programs (PHP) to flexible Intensive Outpatient Programs (IOP).', 3),
('Counseling & Therapy', 'fa-comments', 'counseling-therapy', 'One-on-one, group, and family therapy options specializing in addiction recovery, mental health, and behavioral support.', 'Professional counseling forms the psychological foundation of sustainable recovery. Specializations include cognitive-behavioral therapy (CBT), dialectical behavior therapy (DBT), trauma counseling, and family therapy sessions. Working with an experienced therapist helps unpack underlying triggers and build positive cognitive strategies.', 4),
('Support Groups', 'fa-users', 'support-groups', 'Community-driven peer recovery networks, local meetings, and groups offering shared encouragement and mutual accountability.', 'Peer accountability is highly beneficial for sustaining recovery over time. Support groups such as 12-step programs, SMART Recovery, and local peer support groups offer a strong sense of community and shared experiences. Finding local meetings creates a stable network of understanding friends.', 5),
('Holistic Wellness', 'fa-leaf', 'holistic-wellness', 'Complementary wellness practices including yoga, meditation, acupuncture, sound healing, and nutritional counseling.', 'Integrating holistic wellness practices supports physical recovery and mental centering. Techniques such as mindfulness meditation, yoga, acupuncture, and sound therapy are often combined with traditional clinical treatments to reduce stress and improve overall emotional well-being.', 6)
ON CONFLICT (name) DO UPDATE SET
    icon = EXCLUDED.icon,
    intro = EXCLUDED.intro,
    seo_text = EXCLUDED.seo_text,
    display_order = EXCLUDED.display_order;

-- Seed States
INSERT INTO states (code, name, intro) VALUES
('AL', 'Alabama', 'Find local recovery resources, support groups, and clinical counseling services across the state of Alabama.'),
('AK', 'Alaska', 'Discover substance use treatment resources, inpatient centers, and support networks across Alaska.'),
('AZ', 'Arizona', 'Locate treatment centers, sobriety housing, and outpatient support groups in Arizona.'),
('AR', 'Arkansas', 'Browse recovery services, counselors, and community groups across Arkansas.'),
('CA', 'California', 'Access leading detox facilities, outpatient clinics, therapists, and sober living environments in California.'),
('CO', 'Colorado', 'Find holistic clinics, counselors, and inpatient treatment options throughout Colorado.'),
('CT', 'Connecticut', 'Locate professional recovery networks, therapists, and detox clinics in Connecticut.'),
('DE', 'Delaware', 'Browse outpatient support, counseling, and transitional living facilities across Delaware.'),
('DC', 'District of Columbia', 'Access community support groups, outpatient programs, and mental health assistance in Washington DC.'),
('FL', 'Florida', 'Explore leading rehabilitation centers, sober living transitional houses, and therapists in Florida.'),
('GA', 'Georgia', 'Browse local treatment centers, peer support programs, and mental health clinics in Georgia.'),
('HI', 'Hawaii', 'Locate outpatient programs, detox services, and wellness therapists across Hawaii.'),
('ID', 'Idaho', 'Explore counseling, sober homes, and local support circles in Idaho.'),
('IL', 'Illinois', 'Browse substance use services, dual-diagnosis clinics, and local counselors in Illinois.'),
('IN', 'Indiana', 'Find clinical recovery resources, therapists, and sober environments in Indiana.'),
('IA', 'Iowa', 'Locate outpatient therapy and support groups across Iowa.'),
('KS', 'Kansas', 'Explore addiction counselors, support networks, and detox clinics in Kansas.'),
('KY', 'Kentucky', 'Find professional detox, recovery centers, and therapists across Kentucky.'),
('LA', 'Louisiana', 'Browse addiction treatment services, outpatient programs, and support groups in Louisiana.'),
('ME', 'Maine', 'Locate counselors, sober living programs, and clinical support across Maine.'),
('MD', 'Maryland', 'Access professional counseling, inpatient facilities, and peer groups in Maryland.'),
('MA', 'Massachusetts', 'Explore substance use recovery services, counselors, and support networks in Massachusetts.'),
('MI', 'Michigan', 'Browse treatment clinics, detox services, and community recovery networks in Michigan.'),
('MN', 'Minnesota', 'Find local counseling, treatment centers, and peer accountability groups in Minnesota.'),
('MS', 'Mississippi', 'Locate clinical resources, support groups, and therapists in Mississippi.'),
('MO', 'Missouri', 'Explore substance use recovery programs, counselors, and sober homes across Missouri.'),
('MT', 'Montana', 'Access local treatment centers, peer support networks, and outpatient services in Montana.'),
('NE', 'Nebraska', 'Browse professional therapy, outpatient programs, and recovery assistance in Nebraska.'),
('NV', 'Nevada', 'Find detox programs, rehab facilities, and local support services in Nevada.'),
('NH', 'New Hampshire', 'Locate addiction counselors, support groups, and recovery resources in New Hampshire.'),
('NJ', 'New Jersey', 'Explore premier treatment centers, therapists, and sober housing in New Jersey.'),
('NM', 'New Mexico', 'Find counseling, detox, and outpatient recovery services in New Mexico.'),
('NY', 'New York', 'Access leading rehabilitation centers, therapists, and peer support groups in New York.'),
('NC', 'North Carolina', 'Browse clinical treatment, sober living, and outpatient support in North Carolina.'),
('ND', 'North Dakota', 'Explore addiction counseling, inpatient services, and support networks in North Dakota.'),
('OH', 'Ohio', 'Locate treatment facilities, outpatient support, and peer recovery groups in Ohio.'),
('OK', 'Oklahoma', 'Access local counselors, substance use treatment, and support meetings in Oklahoma.'),
('OR', 'Oregon', 'Explore local outpatient treatment, counseling, and peer recovery circles in Oregon.'),
('PA', 'Pennsylvania', 'Browse clinical recovery clinics, sober living houses, and therapists in Pennsylvania.'),
('RI', 'Rhode Island', 'Locate local support groups, outpatient therapy, and recovery centers in Rhode Island.'),
('SC', 'South Carolina', 'Explore substance use programs, local therapists, and support networks in South Carolina.'),
('SD', 'South Dakota', 'Browse counseling, recovery resources, and support circles in South Dakota.'),
('TN', 'Tennessee', 'Find professional detox, treatment facilities, and support networks in Tennessee.'),
('TX', 'Texas', 'Explore premier treatment clinics, sober homes, and support fellowships in Texas.'),
('UT', 'Utah', 'Locate clinical therapy, treatment facilities, and outpatient programs in Utah.'),
('VT', 'Vermont', 'Browse local recovery centers, support networks, and outpatient services in Vermont.'),
('VA', 'Virginia', 'Access professional counseling, inpatient facilities, and peer support across Virginia.'),
('WA', 'Washington', 'Find clinical counselors, outpatient clinics, and support networks across Washington state.'),
('WV', 'West Virginia', 'Explore addiction recovery assistance, local counselors, and support groups in West Virginia.'),
('WI', 'Wisconsin', 'Locate substance use services, treatment centers, and peer groups in Wisconsin.'),
('WY', 'Wyoming', 'Browse recovery counselors, local support circles, and detox services in Wyoming.')
ON CONFLICT (code) DO UPDATE SET
    name = EXCLUDED.name,
    intro = EXCLUDED.intro;
