create table users (
    id uuid primary key default gen_random_uuid(),
    email varchar(255) unique not null,
    name varchar(255),
    password_hash varchar(255),
    google_id varchar(255) unique,
    avatar_url varchar(500),
    plan varchar(50) default 'free',
    created_at timestamp default now()
);

create table shares (
    id uuid primary key default gen_random_uuid(),
    sender_id uuid references users(id) on delete set null,
    generation_request_id uuid references generation_requests(id) on delete set null,
    recipient_ids varchar(2000),
    file_type varchar(50),
    message varchar(500),
    project_name varchar(255),
    test_count int default 0,
    created_at timestamp not null default now()
);

create index on shares (sender_id, created_at desc);
