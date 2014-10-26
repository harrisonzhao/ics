DROP PROCEDURE IF EXISTS recursiveDelete;
delimiter //
CREATE PROCEDURE recursiveDelete (IN baseId INT)
BEGIN

	SET @toDelete = NULL;

	SELECT idNode
	FROM Nodes
	WHERE idNode = baseId
	INTO @toDelete;

	SET @allDeleted = @toDelete;

	WHILE NOT ISNULL(@toDelete) do
		SET @tmp = NULL;
    
		SELECT idNode
		FROM Nodes
		WHERE idParent IN (@toDelete)
		INTO @tmp;
		
		SET @toDelete = @tmp;
        
        SELECT idNode
        FROM Nodes
        WHERE idNode IN (@toDelete) OR idNode IN (@allDeleted)
        INTO @tmp2;
        
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