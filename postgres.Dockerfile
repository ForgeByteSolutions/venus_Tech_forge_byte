FROM postgres:16

LABEL application="venu-tech-db"
LABEL description="Venu Tech PostgreSQL Database"

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres123
ENV POSTGRES_DB=venu_tech_db
ENV POSTGRES_HOST_AUTH_METHOD=trust

EXPOSE 5432

VOLUME ["/var/lib/postgresql/data"]