FROM centos:centos7
ADD http://nginx.org/download/nginx-1.17.9.tar.gz .
RUN yum install -y pcre-devel wget net-tools gcc zlib zlib-devel make openssl-devel
RUN useradd -M -s /sbin/nologin nginx
RUN tar -zxvf nginx-1.17.9.tar.gz
RUN mkdir -p /usr/local/nginx
RUN cd nginx-1.17.9 && ./configure --prefix=/usr/local/nginx --user=nginx --group=nginx --with-http_stub_status_module --with-http_gzip_static_module && make && make install
RUN ln -s /usr/local/nginx/sbin/* /usr/local/sbin/
 
EXPOSE 80
 
CMD ["nginx", "-g", "daemon off;"]