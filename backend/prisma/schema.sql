-- GlobeTrotter Master PostgreSQL DDL Schema
-- Architecture Specification Compliance: 8 Tables, Relational Integrity & Snapshot Pattern

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop existing tables in reverse dependency order (for clean migrations)
DROP TABLE IF EXISTS shared_links CASCADE;
DROP TABLE IF EXISTS budgets CASCADE;
DROP TABLE IF EXISTS trip_activities CASCADE;
DROP TABLE IF EXISTS stops CASCADE;
DROP TABLE IF EXISTS activities CASCADE;
DROP TABLE IF EXISTS cities CASCADE;
DROP TABLE IF EXISTS trips CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. Users Table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    profile_photo TEXT,
    language_pref VARCHAR(10) NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Trips Table
CREATE TABLE trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    name VARCHAR(200) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    description TEXT,
    cover_photo TEXT,
    is_public BOOLEAN NOT NULL DEFAULT FALSE,
    share_token VARCHAR(100) UNIQUE,
    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_trips_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT check_trip_dates CHECK (end_date >= start_date)
);

-- 3. Cities Reference Table
CREATE TABLE cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    cost_index DECIMAL(5, 2) NOT NULL DEFAULT 1.00,
    popularity_score DECIMAL(5, 2) NOT NULL DEFAULT 0.00,
    image_url TEXT,
    CONSTRAINT uq_city_name_country UNIQUE (name, country)
);

CREATE INDEX idx_cities_country ON cities(country);
CREATE INDEX idx_cities_name ON cities(name);

-- 4. Activities Reference Table
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    city_id UUID NOT NULL,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    duration_mins INT NOT NULL DEFAULT 60,
    description TEXT,
    image_url TEXT,
    CONSTRAINT fk_activities_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE CASCADE,
    CONSTRAINT check_activity_cost CHECK (cost >= 0)
);

CREATE INDEX idx_activities_city_category ON activities(city_id, category);
CREATE INDEX idx_activities_category ON activities(category);

-- 5. Stops Table (Trip <-> City Junction)
CREATE TABLE stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL,
    city_id UUID NOT NULL,
    arrival_date DATE NOT NULL,
    departure_date DATE NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_stops_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    CONSTRAINT fk_stops_city FOREIGN KEY (city_id) REFERENCES cities(id) ON DELETE RESTRICT,
    CONSTRAINT check_stop_dates CHECK (departure_date >= arrival_date)
);

CREATE INDEX idx_stops_trip_sort ON stops(trip_id, sort_order);

-- 6. Trip Activities Table (Snapshot Pattern for Immutable Budgeting)
CREATE TABLE trip_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    stop_id UUID NOT NULL,
    activity_id UUID,
    name_snapshot VARCHAR(200) NOT NULL,
    cost_snapshot DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    category_snapshot VARCHAR(50) NOT NULL,
    scheduled_date DATE,
    time_slot VARCHAR(50),
    sort_order INT NOT NULL DEFAULT 0,
    CONSTRAINT fk_trip_activities_stop FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE,
    CONSTRAINT fk_trip_activities_activity FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE SET NULL,
    CONSTRAINT check_cost_snapshot CHECK (cost_snapshot >= 0)
);

CREATE INDEX idx_trip_activities_stop_sort ON trip_activities(stop_id, sort_order);

-- 7. Budgets Table (1:1 with Trips)
CREATE TABLE budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID UNIQUE NOT NULL,
    daily_cap DECIMAL(10, 2),
    category_caps JSONB NOT NULL DEFAULT '{}'::jsonb,
    CONSTRAINT fk_budgets_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- 8. Shared Links Table
CREATE TABLE shared_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL,
    share_token VARCHAR(100) UNIQUE NOT NULL,
    view_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_shared_links_trip FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

CREATE INDEX idx_shared_links_token ON shared_links(share_token);
