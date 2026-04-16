DELIMITER $$

CREATE PROCEDURE GetNavbarProfile (
    IN p_person_id BIGINT
)
BEGIN
    SELECT 
        person_id,
        CONCAT(first_name, ' ', last_name) AS full_name,
        email,
        COALESCE(
            profile_pic_path,
            '/uploads/profilePictures/defaultProfilePic.jpg'
        ) AS profile_pic_path
    FROM vw_client_full_profile
    WHERE person_id = p_person_id
    LIMIT 1;
END $$

DELIMITER ;

/* select * from vw_client_full_profile;
call `GetNavbarProfile`(101858521812828160); */