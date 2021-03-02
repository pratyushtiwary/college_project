CREATE TABLE `otp` (
  `Username` text NOT NULL,
  `Code` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;


ALTER TABLE `otp`
  ADD UNIQUE KEY `username` (`Username`(10));
COMMIT;
