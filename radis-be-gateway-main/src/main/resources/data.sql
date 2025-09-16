TRUNCATE TABLE users;

INSERT INTO users (username, password, email, roles)
VALUES
    ('admin', '$2y$12$EwUrlBYSdVNAqnJ94Ay4g.8g1rKPpBHGb2BZ6PN8VRz2wL2f4O092', 'admin@example.com', 'ROLE_ADMIN'),
    ('user', '$2y$12$EwUrlBYSdVNAqnJ94Ay4g.8g1rKPpBHGb2BZ6PN8VRz2wL2f4O092', 'user@example.com', 'ROLE_USER');