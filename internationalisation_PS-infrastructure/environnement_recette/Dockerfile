FROM php:7.0-apache
RUN a2enmod rewrite
# Add files to Apache directory
COPY / /var/www/html/
# Symfony configuration to resolve cache problem
RUN chmod -R 777 /var/www/html
RUN rm -rf /var/www/html/app/cache/*
# install mysql driver
RUN docker-php-ext-install pdo pdo_mysql
# install php-gd extension
RUN apt-get update && apt-get install -y \
	libjpeg-dev\
	libpng-dev\
	libfreetype6-dev
RUN docker-php-ext-configure gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ && docker-php-ext-install gd