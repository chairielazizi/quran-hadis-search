-- ==========================================
-- SKEMA PANGKALAN DATA (QURAN & HADIS)
-- ==========================================
-- Fail ini adalah gabungan skema terkini untuk rujukan.

-- 1. Aktifkan extension pgvector (Wajib untuk Semantic Search)
create extension if not exists vector;


-- ==========================================
-- BAHAGIAN 1: AL-QURAN
-- ==========================================
drop index if exists quran_verses_embedding_idx;
drop function if exists match_quran_verses;
drop table if exists quran_verses;

-- Buat jadual untuk Al-Quran
create table quran_verses (
  id serial primary key,
  surah_id integer not null,
  verse_id integer not null,
  text_arabic text not null,
  translation_ms text not null,
  translation_en text,
  -- 3072 adalah saiz vektor untuk model Gemini "gemini-embedding-2"
  embedding vector(3072)
);

-- Fungsi (Stored Procedure) untuk mencari ayat yang paling relevan
create or replace function match_quran_verses (
  query_embedding vector(3072),
  match_threshold float,
  match_count int
)
returns table (
  id integer,
  surah_id integer,
  verse_id integer,
  text_arabic text,
  translation_ms text,
  translation_en text,
  similarity float
)
language sql stable
as $$
  select
    quran_verses.id,
    quran_verses.surah_id,
    quran_verses.verse_id,
    quran_verses.text_arabic,
    quran_verses.translation_ms,
    quran_verses.translation_en,
    1 - (quran_verses.embedding <=> query_embedding) as similarity
  from quran_verses
  where 1 - (quran_verses.embedding <=> query_embedding) > match_threshold
  order by quran_verses.embedding <=> query_embedding
  limit match_count;
$$;

-- Aktifkan RLS & Benarkan bacaan awam
alter table quran_verses enable row level security;
create policy "Allow public read access" on quran_verses for select using (true);


-- ==========================================
-- BAHAGIAN 2: HADIS
-- ==========================================
drop function if exists match_hadith_entries;
drop table if exists hadith_entries;

-- Buat jadual untuk Hadis
create table hadith_entries (
  id serial primary key,
  collection_name text not null,
  hadith_number text not null,
  text_arabic text not null,
  translation_ms text not null,
  translation_en text,
  -- 3072 adalah saiz vektor untuk model Gemini "gemini-embedding-2"
  embedding vector(3072)
);

-- Fungsi (Stored Procedure) untuk mencari hadis yang paling relevan
create or replace function match_hadith_entries (
  query_embedding vector(3072),
  match_threshold float,
  match_count int
)
returns table (
  id integer,
  collection_name text,
  hadith_number text,
  text_arabic text,
  translation_ms text,
  translation_en text,
  similarity float
)
language sql stable
as $$
  select
    hadith_entries.id,
    hadith_entries.collection_name,
    hadith_entries.hadith_number,
    hadith_entries.text_arabic,
    hadith_entries.translation_ms,
    hadith_entries.translation_en,
    1 - (hadith_entries.embedding <=> query_embedding) as similarity
  from hadith_entries
  where 1 - (hadith_entries.embedding <=> query_embedding) > match_threshold
  order by hadith_entries.embedding <=> query_embedding
  limit match_count;
$$;

-- Aktifkan RLS & Benarkan bacaan awam
alter table hadith_entries enable row level security;
create policy "Allow public read access" on hadith_entries for select using (true);
