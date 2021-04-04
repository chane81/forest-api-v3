# elastic beans talk

## eb-cli 설치

- 참고 url
  - <https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/eb-cli3-install-windows.html>
- <https://github.com/pfeilbr/Elastic-Beanstalk-Docker-Node.js-Example>

- 배포
  1. eb 직접 배포 시
     - aws ami 에서 eb-cli 용 사용자 생성
       - eb-user 생성
       - elastic-beans-talk full access 권한 선택하여 생성
     - 개발 콘솔에서 아래 실행
       - aws configure
         - access key / secret key 입력
       - eb init
       - eb deploy [환경명] => eb deploy ForestApi-env
  2. travis 통한 배포
      - travis 설정을 통해 git master 브런치에 push 가 이루어 졌을 때 자동으로 elastic beanstalk 에 배포가 되게 설정 해놓았음

- 개발 이슈
  1. nginx 파일업로드 사이즈 limit 이슈
     - 기본적으로 elastic beanstalk 에 배포하면 nginx 가 가동되어 docker 환경을 proxy **로** 붙게 한다.
     - nginx 기본 업로드 사이즈가 10메가로 잡혀 있기 때문에 따로 nginx config 설정 파일을 만들어서 배포해야한다.
       - .ebextensions 폴더 하위
         - 01_files.config 에 client_max_body_size 를 수동설정

         ```yml
          files:
           "/etc/nginx/conf.d/proxy.conf":
             mode: "000755"
             owner: root
             group: root
             content: |
               client_max_body_size 100M;
         ```
