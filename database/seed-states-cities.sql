-- Seed data for Indian States and Cities
-- This script populates the states and cities tables with Indian location data

-- Insert States
INSERT INTO states (name, code) VALUES
('Andhra Pradesh', 'AP'),
('Arunachal Pradesh', 'AR'),
('Assam', 'AS'),
('Bihar', 'BR'),
('Chhattisgarh', 'CG'),
('Goa', 'GA'),
('Gujarat', 'GJ'),
('Haryana', 'HR'),
('Himachal Pradesh', 'HP'),
('Jharkhand', 'JH'),
('Karnataka', 'KA'),
('Kerala', 'KL'),
('Madhya Pradesh', 'MP'),
('Maharashtra', 'MH'),
('Manipur', 'MN'),
('Meghalaya', 'ML'),
('Mizoram', 'MZ'),
('Nagaland', 'NL'),
('Odisha', 'OR'),
('Punjab', 'PB'),
('Rajasthan', 'RJ'),
('Sikkim', 'SK'),
('Tamil Nadu', 'TN'),
('Telangana', 'TG'),
('Tripura', 'TR'),
('Uttar Pradesh', 'UP'),
('Uttarakhand', 'UK'),
('West Bengal', 'WB'),
('Delhi', 'DL'),
('Puducherry', 'PY'),
('Chandigarh', 'CH'),
('Jammu and Kashmir', 'JK'),
('Ladakh', 'LA')
ON CONFLICT (code) DO NOTHING;

-- Insert Major Cities for each State
-- Karnataka
INSERT INTO cities (state_id, name)
SELECT id, name FROM (VALUES
('Bangalore'), ('Mysore'), ('Hubli'), ('Mangalore'), ('Belgaum'), ('Gulbarga'), ('Davangere'), ('Shimoga'), ('Bijapur'), ('Raichur')
) AS cities(name)
CROSS JOIN (SELECT id FROM states WHERE code = 'KA') AS ka_state
ON CONFLICT (state_id, name) DO NOTHING;

-- Tamil Nadu
INSERT INTO cities (state_id, name)
SELECT id, name FROM (VALUES
('Chennai'), ('Coimbatore'), ('Madurai'), ('Tiruchirappalli'), ('Salem'), ('Tirunelveli'), ('Erode'), ('Vellore'), ('Dindigul'), ('Thanjavur')
) AS cities(name)
CROSS JOIN (SELECT id FROM states WHERE code = 'TN') AS tn_state
ON CONFLICT (state_id, name) DO NOTHING;

-- Maharashtra
INSERT INTO cities (state_id, name)
SELECT id, name FROM (VALUES
('Mumbai'), ('Pune'), ('Nagpur'), ('Nashik'), ('Aurangabad'), ('Solapur'), ('Amravati'), ('Kolhapur'), ('Sangli'), ('Satara')
) AS cities(name)
CROSS JOIN (SELECT id FROM states WHERE code = 'MH') AS mh_state
ON CONFLICT (state_id, name) DO NOTHING;

-- Delhi
INSERT INTO cities (state_id, name)
SELECT id, name FROM (VALUES
('New Delhi'), ('Delhi'), ('Gurgaon'), ('Noida'), ('Faridabad')
) AS cities(name)
CROSS JOIN (SELECT id FROM states WHERE code = 'DL') AS dl_state
ON CONFLICT (state_id, name) DO NOTHING;

-- Gujarat
INSERT INTO cities (state_id, name)
SELECT id, name FROM (VALUES
('Ahmedabad'), ('Surat'), ('Vadodara'), ('Rajkot'), ('Bhavnagar'), ('Jamnagar'), ('Gandhinagar'), ('Anand'), ('Bharuch'), ('Surendranagar')
) AS cities(name)
CROSS JOIN (SELECT id FROM states WHERE code = 'GJ') AS gj_state
ON CONFLICT (state_id, name) DO NOTHING;

-- Rajasthan
INSERT INTO cities (state_id, name)
SELECT id, name FROM (VALUES
('Jaipur'), ('Jodhpur'), ('Kota'), ('Bikaner'), ('Ajmer'), ('Udaipur'), ('Bhilwara'), ('Alwar'), ('Bharatpur'), ('Sikar')
) AS cities(name)
CROSS JOIN (SELECT id FROM states WHERE code = 'RJ') AS rj_state
ON CONFLICT (state_id, name) DO NOTHING;

-- Uttar Pradesh
INSERT INTO cities (state_id, name)
SELECT id, name FROM (VALUES
('Lucknow'), ('Kanpur'), ('Agra'), ('Varanasi'), ('Allahabad'), ('Meerut'), ('Ghaziabad'), ('Bareilly'), ('Aligarh'), ('Moradabad')
) AS cities(name)
CROSS JOIN (SELECT id FROM states WHERE code = 'UP') AS up_state
ON CONFLICT (state_id, name) DO NOTHING;

-- West Bengal
INSERT INTO cities (state_id, name)
SELECT id, name FROM (VALUES
('Kolkata'), ('Howrah'), ('Durgapur'), ('Asansol'), ('Siliguri'), ('Bardhaman'), ('Malda'), ('Kharagpur'), ('Haldia'), ('Jalpaiguri')
) AS cities(name)
CROSS JOIN (SELECT id FROM states WHERE code = 'WB') AS wb_state
ON CONFLICT (state_id, name) DO NOTHING;

-- Andhra Pradesh
INSERT INTO cities (state_id, name)
SELECT id, name FROM (VALUES
('Hyderabad'), ('Vishakhapatnam'), ('Vijayawada'), ('Guntur'), ('Nellore'), ('Kurnool'), ('Rajahmundry'), ('Tirupati'), ('Kakinada'), ('Anantapur')
) AS cities(name)
CROSS JOIN (SELECT id FROM states WHERE code = 'AP') AS ap_state
ON CONFLICT (state_id, name) DO NOTHING;

-- Telangana
INSERT INTO cities (state_id, name)
SELECT id, name FROM (VALUES
('Hyderabad'), ('Warangal'), ('Nizamabad'), ('Karimnagar'), ('Ramagundam'), ('Khammam'), ('Mahbubnagar'), ('Nalgonda'), ('Adilabad'), ('Mancherial')
) AS cities(name)
CROSS JOIN (SELECT id FROM states WHERE code = 'TG') AS tg_state
ON CONFLICT (state_id, name) DO NOTHING;

-- Kerala
INSERT INTO cities (state_id, name)
SELECT id, name FROM (VALUES
('Kochi'), ('Thiruvananthapuram'), ('Kozhikode'), ('Thrissur'), ('Kollam'), ('Alappuzha'), ('Kannur'), ('Kottayam'), ('Palakkad'), ('Malappuram')
) AS cities(name)
CROSS JOIN (SELECT id FROM states WHERE code = 'KL') AS kl_state
ON CONFLICT (state_id, name) DO NOTHING;

-- Odisha
INSERT INTO cities (state_id, name)
SELECT id, name FROM (VALUES
('Bhubaneswar'), ('Cuttack'), ('Rourkela'), ('Berhampur'), ('Sambalpur'), ('Puri'), ('Balasore'), ('Bhadrak'), ('Baripada'), ('Jharsuguda')
) AS cities(name)
CROSS JOIN (SELECT id FROM states WHERE code = 'OR') AS or_state
ON CONFLICT (state_id, name) DO NOTHING;

-- Madhya Pradesh
INSERT INTO cities (state_id, name)
SELECT id, name FROM (VALUES
('Bhopal'), ('Indore'), ('Gwalior'), ('Jabalpur'), ('Ujjain'), ('Raipur'), ('Dewas'), ('Satna'), ('Ratlam'), ('Sagar')
) AS cities(name)
CROSS JOIN (SELECT id FROM states WHERE code = 'MP') AS mp_state
ON CONFLICT (state_id, name) DO NOTHING;

-- Punjab
INSERT INTO cities (state_id, name)
SELECT id, name FROM (VALUES
('Amritsar'), ('Ludhiana'), ('Jalandhar'), ('Patiala'), ('Bathinda'), ('Pathankot'), ('Hoshiarpur'), ('Mohali'), ('Moga'), ('Abohar')
) AS cities(name)
CROSS JOIN (SELECT id FROM states WHERE code = 'PB') AS pb_state
ON CONFLICT (state_id, name) DO NOTHING;

-- Haryana
INSERT INTO cities (state_id, name)
SELECT id, name FROM (VALUES
('Chandigarh'), ('Faridabad'), ('Gurgaon'), ('Panipat'), ('Ambala'), ('Yamunanagar'), ('Rohtak'), ('Hisar'), ('Karnal'), ('Sonipat')
) AS cities(name)
CROSS JOIN (SELECT id FROM states WHERE code = 'HR') AS hr_state
ON CONFLICT (state_id, name) DO NOTHING;

