# Mongle Server Helm Chart

## 소개
이 Helm Chart는 mgmg 애플리케이션을 Kubernetes 클러스터에 배포하기 위한 것입니다.

## 설치 방법

```bash
# 배포 전 템플릿 확인
helm template mgmg ./devops/helm/mgmg

# 애플리케이션 배포
helm install mgmg ./devops/helm/mgmg

# 환경 변수 지정하여 배포
helm install mgmg ./devops/helm/mgmg --set image.repository=<repository> --set image.tag=<tag>
```

## 구성 요소
- Deployment: mgmg 애플리케이션 파드
- Service: 애플리케이션에 대한 서비스
- Ingress: 외부 접근을 위한 인그레스 설정

## 변수 설정
필요한 변수들은 `values.yaml` 파일에서 설정하거나 `--set` 플래그를 사용하여 오버라이드할 수 있습니다.

```bash
helm install mgmg ./devops/helm/mgmg --values custom-values.yaml
```

## 주요 변수
- `replicaCount`: 파드 복제본 수
- `image.repository`: 도커 이미지 저장소
- `image.tag`: 도커 이미지 태그
- `service.port`: 서비스 포트
- `ingress.hosts`: 인그레스 호스트 설정 