# fridgejokes-static
A simplified resurrection of a Persona 4 fan site made in PHP 5.3, but without any PHP capability. Just the static content.

To run the container in local, based on NGINX Alpine:
1. Modify the ports in docker-composer.yml if your local HTTP/S ports are busy.
2. Add your HTTPS certificate keys on the `crt` folder.
3. Or remove the `$scheme` redirect lines at `conf/default.conf` to use HTTP only.
4. `docker build -t fridgejokes-static .`
5. `docker compose up`

Else, you can use any HTTP server of your choice. There are no dependencies, really.
You could even open the .html files manually, if browsers weren't so paranoid with CORS.
