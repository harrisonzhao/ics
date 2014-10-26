DROP PROCEDURE IF EXISTS recursiveDelete;
delimiter //
CREATE PROCEDURE recursiveDelete (IN baseId INT)
BEGIN

	SET @toDelete = NULL;

	SELECT idNode
	FROM Nodes
	WHERE idNode = 1
	INTO @toDelete;

	SET @allDeleted = @toDelete;

	WHILE ~ISNULL(@toDelete) do
		SET @toDelete = NULL;
    /*
		SELECT idNode
		FROM Nodes
		WHERE idParent IN (@toDelete)
		INTO @tmp;
		
		SET @toDelete = @tmp;

		SELECT idNode
        FROM Nodes
        WHERE idNode IN (@allDeleted)
        UNION
        SELECT idNode
        FROM Nodes
        WHERE idNode IN (@toDelete)
        INTO @allDeleted;
        
        */
	END WHILE;

/*

	SELECT (@allDeleted);

	SELECT idNode
	FROM Images
	WHERE idNode IN (@allDeleted)

	DELETE FROM Images
	WHERE idNode IN (@allDeleted);

	DELETE FROM Nodes
	WHERE idNode IN (@allDeleted);
    */
END //
DELIMITER ;