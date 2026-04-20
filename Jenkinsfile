pipeline {
    agent any

    environment {
        IMAGE_NAME = "my-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
        STAGING_CONTAINER = "my-app-staging"
        APP_PORT = "3000"
        STAGING_PORT = "3001"
        RELEASE_TAG = "v1.0.${BUILD_NUMBER}"
    }

    stages {
        stage('Build') {
            steps {
                bat 'npm install'
                bat 'npm run build'
                bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .'
            }
        }

        stage('Test') {
            steps {
                bat 'npm run test:ci'
            }
            post {
                always {
                    junit 'reports/junit/js-test-results.xml'
                }
            }
        }

        stage('Code Quality (SonarQube)') {
            steps {
                bat 'npm run lint'
                withSonarQubeEnv('SonarQube') {
                    bat 'sonar-scanner'
                }
            }
            post {
                success {
                    timeout(time: 5, unit: 'MINUTES') {
                        waitForQualityGate abortPipeline: true
                    }
                }
            }
        }

        stage('Security (Trivy)') {
            steps {
                bat 'docker run --rm -v //var/run/docker.sock:/var/run/docker.sock aquasec/trivy:latest image --severity HIGH,CRITICAL --no-progress %IMAGE_NAME%:%IMAGE_TAG%'
            }
        }

        stage('Deploy (Docker Staging)') {
            steps {
                bat 'docker rm -f %STAGING_CONTAINER% || exit /b 0'
                bat 'docker run -d --name %STAGING_CONTAINER% -p %STAGING_PORT%:%APP_PORT% %IMAGE_NAME%:%IMAGE_TAG%'
            }
        }

        stage('Release (Version Tagging)') {
            steps {
                bat 'git config user.email "jenkins@local"'
                bat 'git config user.name "Jenkins"'
                bat 'git tag %RELEASE_TAG%'
                bat 'echo Release tag created: %RELEASE_TAG%'
            }
        }

        stage('Monitoring (Health + Stats)') {
            steps {
                bat 'curl -f http://localhost:%STAGING_PORT%/'
                bat 'docker logs --tail 50 %STAGING_CONTAINER%'
                bat 'docker stats --no-stream %STAGING_CONTAINER%'
            }
        }
    }

    post {
        success {
            echo 'Pipeline completed successfully.'
        }
        failure {
            echo 'Pipeline failed.'
        }
    }
}