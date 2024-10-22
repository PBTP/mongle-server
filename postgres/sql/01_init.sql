CREATE TYPE auth_provider AS ENUM ('KAKAO', 'APPLE', 'GOOGLE', 'BASIC');

ALTER TYPE auth_provider OWNER TO postgres;

CREATE TYPE gender AS ENUM ('MALE', 'FEMALE');

ALTER TYPE gender OWNER TO postgres;

CREATE TYPE message_type AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO');

ALTER TYPE message_type OWNER TO postgres;

CREATE TYPE appointment_status AS ENUM ('CONFIRMED', 'COMPLETED', 'CANCELLED');

ALTER TYPE appointment_status OWNER TO postgres;

CREATE TYPE checklist_type AS ENUM ('choice', 'answer');

ALTER TYPE checklist_type OWNER TO postgres;

CREATE TYPE pet_checklist_category AS ENUM ('health', 'food', 'grooming', 'personality', 'other');

ALTER TYPE pet_checklist_category OWNER TO postgres;

CREATE TABLE IF NOT EXISTS spatial_ref_sys
(
  srid      INTEGER NOT NULL
    PRIMARY KEY
    CONSTRAINT spatial_ref_sys_srid_check
      CHECK ((srid > 0) AND (srid <= 998999)),
  auth_name VARCHAR(256),
  auth_srid INTEGER,
  srtext    VARCHAR(2048),
  proj4text VARCHAR(2048)
);


GRANT SELECT ON spatial_ref_sys TO PUBLIC;

GRANT DELETE, INSERT, SELECT, UPDATE ON spatial_ref_sys TO postgres;


CREATE TABLE IF NOT EXISTS customers
(
  customer_id             SERIAL
    PRIMARY KEY,
  uuid                    VARCHAR(44)             NOT NULL
    UNIQUE,
  customer_name           VARCHAR(30)             NOT NULL,
  customer_phone_number   TEXT,
  customer_location       geometry,
  auth_provider           auth_provider           NOT NULL,
  created_at              TIMESTAMP DEFAULT NOW() NOT NULL,
  modified_at             TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at              TIMESTAMP,
  refresh_token           TEXT,
  customer_detail_address TEXT,
  customer_address        TEXT
);

COMMENT ON TABLE customers IS '고객';

COMMENT ON COLUMN customers.customer_id IS '고객ID';

COMMENT ON COLUMN customers.uuid IS '식별자 / 외부 서비스에서 사용';

COMMENT ON COLUMN customers.customer_name IS '고객이름';

COMMENT ON COLUMN customers.customer_phone_number IS '고객 연락처';

COMMENT ON COLUMN customers.customer_location IS '고객위치';

COMMENT ON COLUMN customers.auth_provider IS '인증 제공자 (OAuth)';

COMMENT ON COLUMN customers.created_at IS '생성일시';

COMMENT ON COLUMN customers.modified_at IS '수정일시';

COMMENT ON COLUMN customers.deleted_at IS '삭제일시';

COMMENT ON COLUMN customers.refresh_token IS 'JWT 리프레시 토큰';

COMMENT ON COLUMN customers.customer_detail_address IS '고객 상세 주소';

COMMENT ON COLUMN customers.customer_address IS '고객 주소';

ALTER TABLE customers
  OWNER TO postgres;


CREATE UNIQUE INDEX IF NOT EXISTS idx_customers_refresh_token
  ON customers (refresh_token);

GRANT DELETE, INSERT, SELECT, UPDATE ON customers TO postgres;

CREATE TABLE IF NOT EXISTS breed
(
  breed_id          SERIAL NOT NULL
    PRIMARY KEY,
  uuid              VARCHAR(44)                                            NOT NULL
    UNIQUE,
  breed_name        TEXT                                                   NOT NULL
    UNIQUE,
  breed_description TEXT                                                   NOT NULL
);

COMMENT ON TABLE breed IS '견종';

COMMENT ON COLUMN breed.breed_id IS '견종ID';

COMMENT ON COLUMN breed.uuid IS '식별자';

COMMENT ON COLUMN breed.breed_name IS '견종이름';

COMMENT ON COLUMN breed.breed_description IS '견종설명';

ALTER TABLE breed
  OWNER TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON breed TO postgres;

CREATE TABLE IF NOT EXISTS pets
(
  pet_id             SERIAL
    PRIMARY KEY,
  customer_id        INTEGER                 NOT NULL
    REFERENCES customers,
  breed_id           INTEGER                 NOT NULL
    REFERENCES breed,
  uuid               VARCHAR(44)             NOT NULL
    UNIQUE,
  pet_name           VARCHAR(20)             NOT NULL,
  pet_gender         gender                  NOT NULL,
  pet_birthdate      DATE                    NOT NULL,
  pet_weight         DOUBLE PRECISION        NOT NULL,
  neutered_yn        BOOLEAN                 NOT NULL,
  personality        TEXT,
  vaccination_status TEXT                    NOT NULL,
  created_at         TIMESTAMP DEFAULT NOW() NOT NULL,
  modified_at        TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at         TIMESTAMP
);

COMMENT ON TABLE pets IS '반려동물';

COMMENT ON COLUMN pets.pet_id IS '반려동물ID';

COMMENT ON COLUMN pets.customer_id IS '고객ID';

COMMENT ON COLUMN pets.breed_id IS '견종ID';

COMMENT ON COLUMN pets.uuid IS '식별자';

COMMENT ON COLUMN pets.pet_name IS '반려동물이름';

COMMENT ON COLUMN pets.pet_gender IS '반려동물 성별';

COMMENT ON COLUMN pets.pet_birthdate IS '반려동물 생일';

COMMENT ON COLUMN pets.pet_weight IS '반려동물 몸무게';

COMMENT ON COLUMN pets.neutered_yn IS '중성화 유무';

COMMENT ON COLUMN pets.personality IS '반려동물 특성';

COMMENT ON COLUMN pets.vaccination_status IS '예방접종현황';

COMMENT ON COLUMN pets.created_at IS '생성일시';

COMMENT ON COLUMN pets.modified_at IS '수정일시';

COMMENT ON COLUMN pets.deleted_at IS '삭제일시';

ALTER TABLE pets
  OWNER TO postgres;

GRANT SELECT, USAGE ON SEQUENCE pets_pet_id_seq TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON pets TO postgres;

CREATE TABLE IF NOT EXISTS business
(
  business_id           SERIAL
    PRIMARY KEY,
  uuid                  VARCHAR(44)                                  NOT NULL
    UNIQUE,
  business_name         VARCHAR(20)                                  NOT NULL,
  business_phone_number TEXT,
  business_location     geometry,
  business_price_guide  TEXT,
  business_rule         TEXT,
  opening_date          DATE,
  created_at            TIMESTAMP     DEFAULT NOW()                  NOT NULL,
  modified_at           TIMESTAMP     DEFAULT NOW()                  NOT NULL,
  deleted_at            TIMESTAMP,
  auth_provider         auth_provider DEFAULT 'BASIC'::auth_provider NOT NULL,
  refresh_token         TEXT
);

COMMENT ON TABLE business IS '업체';

COMMENT ON COLUMN business.business_id IS '업체ID';

COMMENT ON COLUMN business.uuid IS '식별자';

COMMENT ON COLUMN business.business_name IS '업체이름';

COMMENT ON COLUMN business.business_phone_number IS '업체전화번호';

COMMENT ON COLUMN business.business_location IS '업체위치';

COMMENT ON COLUMN business.business_price_guide IS '업체가격안내';

COMMENT ON COLUMN business.business_rule IS '업체규정';

COMMENT ON COLUMN business.opening_date IS '개업일자';

COMMENT ON COLUMN business.created_at IS '생성일시';

COMMENT ON COLUMN business.modified_at IS '수정일시';

COMMENT ON COLUMN business.deleted_at IS '삭제일시';

ALTER TABLE business
  OWNER TO postgres;

GRANT SELECT, USAGE ON SEQUENCE business_business_id_seq TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON business TO postgres;

CREATE TABLE IF NOT EXISTS business_notices
(
  business_notice_id SERIAL
    PRIMARY KEY,
  business_id        INTEGER                 NOT NULL
    REFERENCES business,
  uuid               VARCHAR(44)             NOT NULL
    UNIQUE,
  title              TEXT                    NOT NULL,
  content            TEXT                    NOT NULL,
  created_at         TIMESTAMP DEFAULT NOW() NOT NULL,
  modified_at        TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at         TIMESTAMP
);

COMMENT ON TABLE business_notices IS '업체공지';

COMMENT ON COLUMN business_notices.business_notice_id IS '업체공지ID';

COMMENT ON COLUMN business_notices.business_id IS '업체ID';

COMMENT ON COLUMN business_notices.uuid IS '식별자';

COMMENT ON COLUMN business_notices.title IS '제목';

COMMENT ON COLUMN business_notices.content IS '내용';

COMMENT ON COLUMN business_notices.created_at IS '생성일시';

COMMENT ON COLUMN business_notices.modified_at IS '수정일시';

COMMENT ON COLUMN business_notices.deleted_at IS '삭제일시';

ALTER TABLE business_notices
  OWNER TO postgres;

GRANT SELECT, USAGE ON SEQUENCE business_notices_business_notice_id_seq TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON business_notices TO postgres;

CREATE TABLE IF NOT EXISTS tags
(
  tag_id   SERIAL
    PRIMARY KEY,
  tag_name VARCHAR(20) NOT NULL
    UNIQUE
);

COMMENT ON TABLE tags IS '태그';

COMMENT ON COLUMN tags.tag_id IS '태그ID';

COMMENT ON COLUMN tags.tag_name IS '태그이름';

ALTER TABLE tags
  OWNER TO postgres;

GRANT SELECT, USAGE ON SEQUENCE tags_tag_id_seq TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON tags TO postgres;

CREATE TABLE IF NOT EXISTS business_tags
(
  business_id INTEGER                 NOT NULL
    REFERENCES business,
  tag_id      INTEGER                 NOT NULL
    REFERENCES tags,
  created_at  TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT business_tags_pk
    PRIMARY KEY (business_id, tag_id)
);

COMMENT ON TABLE business_tags IS '업체태그';

COMMENT ON COLUMN business_tags.business_id IS '업체ID';

COMMENT ON COLUMN business_tags.tag_id IS '태그ID';

COMMENT ON COLUMN business_tags.created_at IS '생성일시';

ALTER TABLE business_tags
  OWNER TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON business_tags TO postgres;

CREATE TABLE IF NOT EXISTS badges
(
  badge_id          SERIAL
    PRIMARY KEY,
  badge_name        VARCHAR(20) NOT NULL
    UNIQUE,
  badge_description TEXT        NOT NULL
);

COMMENT ON TABLE badges IS '뱃지';

COMMENT ON COLUMN badges.badge_id IS '뱃지ID';

COMMENT ON COLUMN badges.badge_name IS '뱃지이름';

COMMENT ON COLUMN badges.badge_description IS '뱃지설명';

ALTER TABLE badges
  OWNER TO postgres;

GRANT SELECT, USAGE ON SEQUENCE badges_badge_id_seq TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON badges TO postgres;

CREATE TABLE IF NOT EXISTS business_badges
(
  business_id INTEGER                 NOT NULL
    REFERENCES business,
  badge_id    INTEGER                 NOT NULL
    REFERENCES badges,
  created_at  TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT business_badges_pk
    PRIMARY KEY (business_id, badge_id)
);

COMMENT ON TABLE business_badges IS '업체뱃지';

COMMENT ON COLUMN business_badges.business_id IS '업체ID';

COMMENT ON COLUMN business_badges.badge_id IS '뱃지ID';

COMMENT ON COLUMN business_badges.created_at IS '생성일시';

ALTER TABLE business_badges
  OWNER TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON business_badges TO postgres;

CREATE TABLE IF NOT EXISTS images
(
  image_id   SERIAL
    PRIMARY KEY,
  uuid       VARCHAR(44)             NOT NULL,
  image_url  TEXT                    NOT NULL
    CONSTRAINT images_image_link_unique
      UNIQUE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE images IS '이미지';

COMMENT ON COLUMN images.image_id IS '이미지ID';

COMMENT ON COLUMN images.uuid IS '식별자';

COMMENT ON COLUMN images.image_url IS '이미지 링크';

COMMENT ON COLUMN images.created_at IS '생성일시';

ALTER TABLE images
  OWNER TO postgres;

GRANT SELECT, USAGE ON SEQUENCE images_image_id_seq TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON images TO postgres;
CREATE TYPE pet_size AS ENUM ('SMALL', 'MEDIUM', 'LARGE');
CREATE TABLE IF NOT EXISTS service_options
(
  service_option_id          SERIAL
    PRIMARY KEY,
  business_id                INTEGER                 NOT NULL
    REFERENCES business,
  uuid                       VARCHAR(44)             NOT NULL
    UNIQUE,
  service_option_description TEXT                    NOT NULL,
  service_option_price       INTEGER                 NOT NULL,
  pet_size                   pet_size                NOT NULL,
  created_at                 TIMESTAMP DEFAULT NOW() NOT NULL,
  modified_at                TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at                 TIMESTAMP
);

COMMENT ON TABLE service_options IS '서비스 옵션';

COMMENT ON COLUMN service_options.service_option_id IS '서비스 옵션 ID';

COMMENT ON COLUMN service_options.business_id IS '업체ID';

COMMENT ON COLUMN service_options.uuid IS '식별자';

COMMENT ON COLUMN service_options.service_option_description IS '서비스옵션 설명';

COMMENT ON COLUMN service_options.service_option_price IS '서비스 옵션 가격';

COMMENT ON COLUMN service_options.pet_size IS '반려동물 크기';

COMMENT ON COLUMN service_options.created_at IS '생성일시';

COMMENT ON COLUMN service_options.modified_at IS '수정일시';

COMMENT ON COLUMN service_options.deleted_at IS '삭제일시';

ALTER TABLE service_options
  OWNER TO postgres;

GRANT SELECT, USAGE ON SEQUENCE service_options_service_option_id_seq TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON service_options TO postgres;

CREATE TABLE IF NOT EXISTS drivers
(
  driver_id           SERIAL
    PRIMARY KEY,
  business_id         INTEGER                                      NOT NULL
    REFERENCES business,
  uuid                VARCHAR(44)                                  NOT NULL
    UNIQUE,
  driver_name         VARCHAR(20)                                  NOT NULL,
  driver_phone_number VARCHAR(30)                                  NOT NULL,
  created_at          TIMESTAMP     DEFAULT NOW()                  NOT NULL,
  modified_at         TIMESTAMP     DEFAULT NOW()                  NOT NULL,
  deleted_at          TIMESTAMP,
  refresh_token       TEXT,
  auth_provider       auth_provider DEFAULT 'BASIC'::auth_provider NOT NULL
);

COMMENT ON TABLE drivers IS '기사';

COMMENT ON COLUMN drivers.driver_id IS '기사ID';

COMMENT ON COLUMN drivers.business_id IS '업체ID';

COMMENT ON COLUMN drivers.uuid IS '식별자';

COMMENT ON COLUMN drivers.driver_name IS '기사이름';

COMMENT ON COLUMN drivers.driver_phone_number IS '기사 휴대폰 번호';

COMMENT ON COLUMN drivers.created_at IS '생성일시';

COMMENT ON COLUMN drivers.modified_at IS '수정일시';

COMMENT ON COLUMN drivers.deleted_at IS '삭제일시';

COMMENT ON COLUMN drivers.refresh_token IS 'JWT 리프레시 토큰';

ALTER TABLE drivers
  OWNER TO postgres;

GRANT SELECT, USAGE ON SEQUENCE drivers_driver_id_seq TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON drivers TO postgres;

CREATE TABLE IF NOT EXISTS driver_chats
(
  driver_chat_id SERIAL
    PRIMARY KEY,
  driver_id      INTEGER                 NOT NULL
    REFERENCES drivers,
  customer_id    INTEGER                 NOT NULL
    REFERENCES customers,
  uuid           CHAR(20)                NOT NULL
    UNIQUE,
  created_at     TIMESTAMP DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE driver_chats IS '기사 채팅';

COMMENT ON COLUMN driver_chats.driver_chat_id IS '기사 채팅ID';

COMMENT ON COLUMN driver_chats.driver_id IS '기사ID';

COMMENT ON COLUMN driver_chats.customer_id IS '고객ID';

COMMENT ON COLUMN driver_chats.uuid IS '식별자';

COMMENT ON COLUMN driver_chats.created_at IS '생성일시';

ALTER TABLE driver_chats
  OWNER TO postgres;

GRANT SELECT, USAGE ON SEQUENCE driver_chats_driver_chat_id_seq TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON driver_chats TO postgres;

CREATE TABLE IF NOT EXISTS driver_chat_messages
(
  driver_chat_message_id      SERIAL
    PRIMARY KEY,
  driver_chat_id              INTEGER                 NOT NULL
    REFERENCES driver_chats,
  sender_uuid                 CHAR(20)                NOT NULL,
  uuid                        CHAR(20)                NOT NULL
    UNIQUE,
  driver_chat_message_type    message_type            NOT NULL,
  driver_chat_message_content TEXT                    NOT NULL,
  created_at                  TIMESTAMP DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE driver_chat_messages IS '기사 채팅 메시지';

COMMENT ON COLUMN driver_chat_messages.driver_chat_message_id IS '기사 채팅 메시지 ID';

COMMENT ON COLUMN driver_chat_messages.driver_chat_id IS '기사 채팅ID';

COMMENT ON COLUMN driver_chat_messages.sender_uuid IS '발신자식별자';

COMMENT ON COLUMN driver_chat_messages.uuid IS '식별자';

COMMENT ON COLUMN driver_chat_messages.driver_chat_message_type IS '메시지타입';

COMMENT ON COLUMN driver_chat_messages.driver_chat_message_content IS '메시지내용';

COMMENT ON COLUMN driver_chat_messages.created_at IS '생성일시';

ALTER TABLE driver_chat_messages
  OWNER TO postgres;

GRANT SELECT, USAGE ON SEQUENCE driver_chat_messages_driver_chat_message_id_seq TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON driver_chat_messages TO postgres;

CREATE TABLE IF NOT EXISTS appointments
(
  appointment_id                SERIAL
    PRIMARY KEY,
  customer_id                   INTEGER                 NOT NULL
    REFERENCES customers,
  business_id                   INTEGER                 NOT NULL
    REFERENCES business,
  driver_id                     INTEGER                 NOT NULL
    REFERENCES drivers,
  pet_id                        INTEGER                 NOT NULL
    REFERENCES pets,
  service_option_id             INTEGER                 NOT NULL
    REFERENCES service_options,
  uuid                          VARCHAR(44)             NOT NULL
    UNIQUE,
  appointment_date              DATE                    NOT NULL,
  appointment_start_time        TIME                    NOT NULL,
  appointment_end_time          TIME                    NOT NULL,
  appointment_status            appointment_status      NOT NULL,
  special_request               TEXT,
  visit_parking_location        geometry,
  visit_parking_location_detail TEXT,
  created_at                    TIMESTAMP DEFAULT NOW() NOT NULL,
  modified_at                   TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at                    TIMESTAMP
);

COMMENT ON TABLE appointments IS '예약';

COMMENT ON COLUMN appointments.appointment_id IS '예약ID';

COMMENT ON COLUMN appointments.customer_id IS '고객ID';

COMMENT ON COLUMN appointments.business_id IS '업체ID';

COMMENT ON COLUMN appointments.driver_id IS '기사ID';

COMMENT ON COLUMN appointments.pet_id IS '반려동물ID';

COMMENT ON COLUMN appointments.service_option_id IS '서비스옵션ID';

COMMENT ON COLUMN appointments.uuid IS '식별자';

COMMENT ON COLUMN appointments.appointment_date IS '예약날짜';

COMMENT ON COLUMN appointments.appointment_start_time IS '예약시작시간';

COMMENT ON COLUMN appointments.appointment_end_time IS '예약종료시간';

COMMENT ON COLUMN appointments.appointment_status IS '예약상태';

COMMENT ON COLUMN appointments.special_request IS '요청사항';

COMMENT ON COLUMN appointments.visit_parking_location IS '방문주차위치';

COMMENT ON COLUMN appointments.visit_parking_location_detail IS '방문주차상ㅅ';

COMMENT ON COLUMN appointments.created_at IS '생성일시';

COMMENT ON COLUMN appointments.modified_at IS '수정일시';

COMMENT ON COLUMN appointments.deleted_at IS '삭제일시';

ALTER TABLE appointments
  OWNER TO postgres;

GRANT SELECT, USAGE ON SEQUENCE appointments_appointment_id_seq TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON appointments TO postgres;

CREATE TABLE IF NOT EXISTS reviews
(
  review_id      SERIAL
    PRIMARY KEY,
  appointment_id INTEGER                 NOT NULL
    REFERENCES appointments,
  customer_id    INTEGER                 NOT NULL
    REFERENCES customers,
  business_id    INTEGER                 NOT NULL
    REFERENCES business,
  pet_id         INTEGER                 NOT NULL
    REFERENCES pets,
  uuid           VARCHAR(44)             NOT NULL
    UNIQUE,
  rating         DOUBLE PRECISION        NOT NULL,
  content        TEXT                    NOT NULL,
  created_at     TIMESTAMP DEFAULT NOW() NOT NULL,
  modified_at    TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at     TIMESTAMP
);

COMMENT ON TABLE reviews IS '리뷰';

COMMENT ON COLUMN reviews.review_id IS '리뷰ID';

COMMENT ON COLUMN reviews.appointment_id IS '예약ID';

COMMENT ON COLUMN reviews.customer_id IS '고객ID';

COMMENT ON COLUMN reviews.business_id IS '업체ID';

COMMENT ON COLUMN reviews.pet_id IS '반려동물ID';

COMMENT ON COLUMN reviews.uuid IS '식별자';

COMMENT ON COLUMN reviews.rating IS '평점';

COMMENT ON COLUMN reviews.content IS '내용';

COMMENT ON COLUMN reviews.created_at IS '생성일시';

COMMENT ON COLUMN reviews.modified_at IS '수정일시';

COMMENT ON COLUMN reviews.deleted_at IS '삭제일시';

ALTER TABLE reviews
  OWNER TO postgres;

GRANT SELECT, USAGE ON SEQUENCE reviews_review_id_seq TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON reviews TO postgres;

CREATE TABLE IF NOT EXISTS favorites
(
  customer_id INTEGER                 NOT NULL
    REFERENCES customers,
  business_id INTEGER                 NOT NULL
    REFERENCES business,
  uuid        VARCHAR(44)             NOT NULL,
  created_at  TIMESTAMP DEFAULT NOW() NOT NULL,
  UNIQUE (customer_id, business_id)
);

COMMENT ON TABLE favorites IS '즐겨찾기';

COMMENT ON COLUMN favorites.customer_id IS '고객ID';

COMMENT ON COLUMN favorites.business_id IS '업체ID';

COMMENT ON COLUMN favorites.uuid IS '식별자';

COMMENT ON COLUMN favorites.created_at IS '생성일시';

ALTER TABLE favorites
  OWNER TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON favorites TO postgres;

CREATE TABLE IF NOT EXISTS business_chats
(
  business_chat_id SERIAL
    PRIMARY KEY,
  business_id      INTEGER                 NOT NULL
    REFERENCES business,
  customer_id      INTEGER                 NOT NULL
    REFERENCES customers,
  uuid             CHAR(20)                NOT NULL
    UNIQUE,
  created_at       TIMESTAMP DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE business_chats IS '업체채팅';

COMMENT ON COLUMN business_chats.business_chat_id IS '업체채팅방ID';

COMMENT ON COLUMN business_chats.business_id IS '업체ID';

COMMENT ON COLUMN business_chats.customer_id IS '고객ID';

COMMENT ON COLUMN business_chats.uuid IS '식별자';

COMMENT ON COLUMN business_chats.created_at IS '생성일시';

ALTER TABLE business_chats
  OWNER TO postgres;

GRANT SELECT, USAGE ON SEQUENCE business_chats_business_chat_id_seq TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON business_chats TO postgres;

CREATE TABLE IF NOT EXISTS business_chat_messages
(
  business_chat_message_id      SERIAL
    PRIMARY KEY,
  business_chat_id              INTEGER                 NOT NULL
    REFERENCES business_chats,
  sender_uuid                   CHAR(20)                NOT NULL,
  uuid                          VARCHAR(44)             NOT NULL
    UNIQUE,
  business_chat_message_type    message_type            NOT NULL,
  business_chat_message_content TEXT                    NOT NULL,
  created_at                    TIMESTAMP DEFAULT NOW() NOT NULL
);

COMMENT ON TABLE business_chat_messages IS '업체채팅메시지';

COMMENT ON COLUMN business_chat_messages.business_chat_message_id IS '업체채팅메시지ID';

COMMENT ON COLUMN business_chat_messages.business_chat_id IS '업체채팅방ID';

COMMENT ON COLUMN business_chat_messages.sender_uuid IS '발신자 식별자';

COMMENT ON COLUMN business_chat_messages.uuid IS '식별자';

COMMENT ON COLUMN business_chat_messages.business_chat_message_type IS '메시지 타입';

COMMENT ON COLUMN business_chat_messages.business_chat_message_content IS '메시지 내용';

COMMENT ON COLUMN business_chat_messages.created_at IS '생성일시';

ALTER TABLE business_chat_messages
  OWNER TO postgres;

GRANT SELECT, USAGE ON SEQUENCE business_chat_messages_business_chat_message_id_seq TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON business_chat_messages TO postgres;

CREATE TABLE IF NOT EXISTS sms_verifications
(
  id                SERIAL
    PRIMARY KEY,
  phone_number      VARCHAR(15) NOT NULL,
  verification_code VARCHAR(6)  NOT NULL,
  created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expired_at        TIMESTAMP   NOT NULL,
  verified_at       TIMESTAMP,
  verification_id   uuid
);

ALTER TABLE sms_verifications
  OWNER TO postgres;

GRANT SELECT, USAGE ON SEQUENCE sms_verifications_id_seq TO postgres;

CREATE INDEX IF NOT EXISTS idx_phone_number
  ON sms_verifications (phone_number);

CREATE INDEX IF NOT EXISTS idx_verification_code
  ON sms_verifications (verification_code);

CREATE INDEX IF NOT EXISTS idx_verified_at
  ON sms_verifications (verified_at);

GRANT DELETE, INSERT, SELECT, UPDATE ON sms_verifications TO postgres;

CREATE TABLE IF NOT EXISTS chat_rooms
(
  chat_room_id   SERIAL
    PRIMARY KEY,
  tsid           CHAR(13)                NOT NULL
    UNIQUE,
  created_at     TIMESTAMP DEFAULT NOW() NOT NULL,
  chat_room_name VARCHAR(50)             NOT NULL
);

COMMENT ON TABLE chat_rooms IS '채팅방';

COMMENT ON COLUMN chat_rooms.chat_room_id IS '채팅방ID';

COMMENT ON COLUMN chat_rooms.tsid IS '식별자';

COMMENT ON COLUMN chat_rooms.created_at IS '생성일시';

COMMENT ON COLUMN chat_rooms.chat_room_name IS '채팅방이름';

ALTER TABLE chat_rooms
  OWNER TO postgres;

GRANT SELECT, USAGE ON SEQUENCE chat_rooms_chat_room_id_seq TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON chat_rooms TO postgres;

CREATE TABLE IF NOT EXISTS customer_chat_rooms
(
  customer_id  INTEGER                 NOT NULL
    REFERENCES customers,
  chat_room_id INTEGER                 NOT NULL
    REFERENCES chat_rooms,
  created_at   TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at   TIMESTAMP,
  CONSTRAINT customer_chat_rooms_pk
    PRIMARY KEY (customer_id, chat_room_id)
);

COMMENT ON TABLE customer_chat_rooms IS '고객채팅방';

COMMENT ON COLUMN customer_chat_rooms.customer_id IS '고객ID';

COMMENT ON COLUMN customer_chat_rooms.chat_room_id IS '채팅방ID';

COMMENT ON COLUMN customer_chat_rooms.created_at IS '생성일시';

COMMENT ON COLUMN customer_chat_rooms.deleted_at IS '삭제일시';

ALTER TABLE customer_chat_rooms
  OWNER TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON customer_chat_rooms TO postgres;

CREATE TABLE IF NOT EXISTS driver_chat_rooms
(
  driver_id    INTEGER                 NOT NULL
    REFERENCES drivers,
  chat_room_id INTEGER                 NOT NULL
    REFERENCES chat_rooms,
  created_at   TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at   TIMESTAMP,
  CONSTRAINT driver_chat_rooms_pk
    PRIMARY KEY (driver_id, chat_room_id)
);

COMMENT ON TABLE driver_chat_rooms IS '기사채팅방';

COMMENT ON COLUMN driver_chat_rooms.driver_id IS '기사ID';

COMMENT ON COLUMN driver_chat_rooms.chat_room_id IS '채팅방ID';

COMMENT ON COLUMN driver_chat_rooms.created_at IS '생성일시';

COMMENT ON COLUMN driver_chat_rooms.deleted_at IS '삭제일시';

ALTER TABLE driver_chat_rooms
  OWNER TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON driver_chat_rooms TO postgres;

CREATE TABLE IF NOT EXISTS business_chat_rooms
(
  business_id  INTEGER                 NOT NULL
    REFERENCES business,
  chat_room_id INTEGER                 NOT NULL
    REFERENCES chat_rooms,
  created_at   TIMESTAMP DEFAULT NOW() NOT NULL,
  deleted_at   TIMESTAMP,
  CONSTRAINT business_chat_rooms_pk
    PRIMARY KEY (business_id, chat_room_id)
);

COMMENT ON TABLE business_chat_rooms IS '업체채팅방';

COMMENT ON COLUMN business_chat_rooms.business_id IS '업체ID';

COMMENT ON COLUMN business_chat_rooms.chat_room_id IS '채팅방ID';

COMMENT ON COLUMN business_chat_rooms.created_at IS '생성일시';

COMMENT ON COLUMN business_chat_rooms.deleted_at IS '삭제일시';

ALTER TABLE business_chat_rooms
  OWNER TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON business_chat_rooms TO postgres;

CREATE TABLE IF NOT EXISTS chat_messages
(
  chat_message_id      INTEGER                 NOT NULL,
  chat_room_id         INTEGER                 NOT NULL
    CONSTRAINT fk_chat_messages_from_chat_rooms
      REFERENCES chat_rooms,
  sender_uuid          VARCHAR(44)             NOT NULL,
  tsid                 CHAR(13)                NOT NULL
    UNIQUE,
  chat_message_type    message_type            NOT NULL,
  chat_message_content TEXT                    NOT NULL,
  created_at           TIMESTAMP DEFAULT NOW() NOT NULL,
  CONSTRAINT pk_chat_messages
    PRIMARY KEY (chat_message_id, chat_room_id)
);

COMMENT ON TABLE chat_messages IS '채팅 메시지';

COMMENT ON COLUMN chat_messages.chat_message_id IS '메시지 ID';

COMMENT ON COLUMN chat_messages.chat_room_id IS '채팅ID';

COMMENT ON COLUMN chat_messages.sender_uuid IS '발신자식별자';

COMMENT ON COLUMN chat_messages.tsid IS '식별자';

COMMENT ON COLUMN chat_messages.chat_message_type IS '메시지타입';

COMMENT ON COLUMN chat_messages.chat_message_content IS '메시지내용';

COMMENT ON COLUMN chat_messages.created_at IS '생성일시';

ALTER TABLE chat_messages
  OWNER TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON chat_messages TO postgres;

CREATE TABLE IF NOT EXISTS pet_checklist
(
  pet_checklist_id       SERIAL
    PRIMARY KEY,
  pet_checklist_type     checklist_type         NOT NULL,
  pet_checklist_category pet_checklist_category NOT NULL,
  pet_checklist_content  TEXT                   NOT NULL
);

COMMENT ON TABLE pet_checklist IS '반려동물 체크리스트';

COMMENT ON COLUMN pet_checklist.pet_checklist_id IS '반려동물 체크리스트 아이디';

COMMENT ON COLUMN pet_checklist.pet_checklist_type IS '반려동물 체크리스트 타입';

COMMENT ON COLUMN pet_checklist.pet_checklist_category IS '반려동물 체크리스트 카테고리';

COMMENT ON COLUMN pet_checklist.pet_checklist_content IS '반려동물 체크리스트 제목';

ALTER TABLE pet_checklist
  OWNER TO postgres;

GRANT SELECT, USAGE ON SEQUENCE pet_checklist_pet_checklist_id_seq TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON pet_checklist TO postgres;

CREATE TABLE IF NOT EXISTS pet_checklist_answers
(
  pet_id               INTEGER NOT NULL
    REFERENCES pets,
  pet_checklist_id     INTEGER NOT NULL
    REFERENCES pet_checklist,
  pet_checklist_answer TEXT    NOT NULL,
  PRIMARY KEY (pet_id, pet_checklist_id)
);

COMMENT ON TABLE pet_checklist_answers IS '반려동물 체크리스트 답변';

COMMENT ON COLUMN pet_checklist_answers.pet_id IS '반려동물 아이디';

COMMENT ON COLUMN pet_checklist_answers.pet_checklist_id IS '반려동물 체크리스트 아이디';

COMMENT ON COLUMN pet_checklist_answers.pet_checklist_answer IS '반려동물 체크리스트 답변';

ALTER TABLE pet_checklist_answers
  OWNER TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON pet_checklist_answers TO postgres;

CREATE TABLE IF NOT EXISTS pet_checklist_choices
(
  pet_checklist_choice_id      SERIAL,
  pet_checklist_id             INTEGER NOT NULL
    REFERENCES pet_checklist,
  pet_checklist_choice_content TEXT    NOT NULL,
  PRIMARY KEY (pet_checklist_choice_id, pet_checklist_id)
);

COMMENT ON TABLE pet_checklist_choices IS '반려동물 체크리스트 선택지';

COMMENT ON COLUMN pet_checklist_choices.pet_checklist_choice_id IS '반려동물 체크리스트 선택지 아이디';

COMMENT ON COLUMN pet_checklist_choices.pet_checklist_id IS '반려동물 체크리스트 아이디';

COMMENT ON COLUMN pet_checklist_choices.pet_checklist_choice_content IS '반려동물 체크리스트 선택지 내용';

ALTER TABLE pet_checklist_choices
  OWNER TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON pet_checklist_choices TO postgres;

CREATE TABLE IF NOT EXISTS pet_checklist_choices_answers
(
  pet_id                  INTEGER NOT NULL
    REFERENCES pets,
  pet_checklist_id        INTEGER NOT NULL,
  pet_checklist_choice_id INTEGER NOT NULL,
  PRIMARY KEY (pet_id, pet_checklist_id, pet_checklist_choice_id),
  CONSTRAINT pet_checklist_choices_answers_pet_checklist_id_pet_checkli_fkey
    FOREIGN KEY (pet_checklist_id, pet_checklist_choice_id) REFERENCES pet_checklist_choices
);

COMMENT ON TABLE pet_checklist_choices_answers IS '반려동물 체크리스트 선택지 답변';

COMMENT ON COLUMN pet_checklist_choices_answers.pet_id IS '반려동물 아이디';

COMMENT ON COLUMN pet_checklist_choices_answers.pet_checklist_id IS '반려동물 체크리스트 아이디';

COMMENT ON COLUMN pet_checklist_choices_answers.pet_checklist_choice_id IS '반려동물 체크리스트 선택지 아이디';

ALTER TABLE pet_checklist_choices_answers
  OWNER TO postgres;

GRANT DELETE, INSERT, SELECT, UPDATE ON pet_checklist_choices_answers TO postgres;

CREATE OR REPLACE FUNCTION random_element(elements ANYARRAY) RETURNS ANYELEMENT AS
$$
BEGIN
  RETURN elements[1 + FLOOR(RANDOM() * ARRAY_LENGTH(elements, 1))::INTEGER];
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION customer_dummy_data_insert(add_row INT) RETURNS VOID AS
$$
BEGIN
  INSERT INTO customers
    ( uuid
    , customer_name
    , customer_phone_number
    , customer_location
    , auth_provider
    , created_at
    , modified_at
    , refresh_token
    , customer_detail_address
    , customer_address)
  SELECT SUBSTRING(gen_random_uuid()::TEXT, 0, 44)
       , 'John ' || CHR(65 + FLOOR(RANDOM() * 26)::INT)                                      -- 예: John A, John B 등
       , random_element(ARRAY ['010-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0') || '-' ||
                               LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'),NULL])
       , random_element(ARRAY [st_geomfromtext('POINT(' || (127 + RANDOM()) || ' ' || (37 + RANDOM()) || ')', 4326),NULL])
       , random_element(ARRAY ['GOOGLE', 'KAKAO', 'APPLE'])::auth_provider
       , NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 30 + 1)
       , NOW()
       , gen_random_uuid() || FLOOR(RANDOM() * 10000)::TEXT
       , random_element(ARRAY ['Apt ' || FLOOR(RANDOM() * 100 + 1)::TEXT || 'Some Building', NULL])
       , random_element(ARRAY ['서울특별시 강남구 테헤란로 ' || FLOOR(RANDOM() * 1000 + 1)::TEXT, NULL]) -- 예: 서울특별시 강남구 테헤란로 123
    FROM GENERATE_SERIES(1, add_row);
END ;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION business_dummy_data_insert(add_row INT) RETURNS VOID AS
$$
BEGIN
  INSERT INTO business
    ( uuid
    , business_name
    , business_phone_number
    , business_location
    , business_price_guide
    , business_rule
    , opening_date
    , created_at
    , modified_at
    , auth_provider
    , refresh_token)


  SELECT SUBSTRING(gen_random_uuid()::TEXT, 0, 44)
       , 'Business ' || CHR(65 + FLOOR(RANDOM() * 26)::INT)
       , random_element(ARRAY ['010-' || LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0') || '-' ||
                               LPAD(FLOOR(RANDOM() * 9000 + 1000)::TEXT, 4, '0'), NULL])
       , random_element(ARRAY [st_geomfromtext('POINT(' || (127 + RANDOM()) || ' ' || (37 + RANDOM()) || ')',
                                               4326), NULL])
       , random_element(ARRAY ['LOW', 'MIDDLE', 'HIGH'])
       , random_element(ARRAY ['RULE1', 'RULE2', 'RULE3'])
       , NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 30 + 1)
       , NOW() - INTERVAL '1 day' * FLOOR(RANDOM() * 30 + 1)
       , NOW()
       , random_element(ARRAY ['GOOGLE', 'KAKAO', 'APPLE'])::auth_provider
       , gen_random_uuid() || FLOOR(RANDOM() * 10000)::TEXT

    FROM GENERATE_SERIES(1, add_row);
END;
$$ LANGUAGE plpgsql;
