-- KOPYALAYIP SUPABASE SQL EDITOR'UNE YAPIŞTIRIN
-- Bu dosya PT projesinin Supabase üzerindeki tablolarını ve RLS güvenlik kurallarını kurar.

-- 1. Tabloların Oluşturulması
CREATE TABLE public.clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users NOT NULL, -- Hangi antrenöre ait olduğu
    name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    package_type TEXT,
    start_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.leads (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    message TEXT,
    source TEXT DEFAULT 'Landing Page',
    status TEXT DEFAULT 'New', -- New, Contacted, Converted
    height DECIMAL,
    weight DECIMAL,
    age INTEGER,
    health_issues TEXT,
    allergies TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE TABLE public.measurements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID REFERENCES public.clients ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    weight DECIMAL,
    body_fat DECIMAL,
    shoulder DECIMAL,
    chest DECIMAL,
    waist DECIMAL,
    hip DECIMAL,
    leg DECIMAL,
    arm DECIMAL,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Row Level Security (RLS) Etkinleştirme
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;

-- 3. RLS Güvenlik Kuralları (Müşterileri Sadece Kendi Antrenörü Görebilir)
CREATE POLICY "Antrenörler kendi müşterilerini görebilir" ON public.clients
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Antrenörler kendi müşterilerini ekleyebilir" ON public.clients
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Antrenörler kendi müşterilerini güncelleyebilir" ON public.clients
    FOR UPDATE USING (auth.uid() = user_id);

-- Dışarıdan form dolduran misafirlerin Lead atabilmesi (Public Insert)
CREATE POLICY "Misafirler lead oluşturabilir" ON public.leads
    FOR INSERT WITH CHECK (true);

-- Antrenörün leadleri görebilmesi
CREATE POLICY "Antrenörler tüm leadleri görebilir" ON public.leads
    FOR SELECT USING (auth.role() = 'authenticated');
