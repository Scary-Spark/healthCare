CREATE TABLE person_address (
    person_id BIGINT NOT NULL,
    upazila_id INT NOT NULL,

    PRIMARY KEY (person_id, upazila_id),

    FOREIGN KEY (person_id) REFERENCES persons(person_id),
    FOREIGN KEY (upazila_id) REFERENCES upazilas(upazila_id)
);

ALTER TABLE person_address 
ADD COLUMN postal_code INT,
ADD COLUMN street_address TEXT;


