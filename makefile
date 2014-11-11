production:
	sudo MODE=production forever start app.js
development:
	node app.js
stop:
	sudo forever stopall
