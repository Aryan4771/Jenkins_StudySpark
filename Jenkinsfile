pipeline {
    agent any

    environment {
        IMAGE_NAME = "my-app"
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
            git branch: 'main', url: 'https://github.com/Aryan4771/Jenkins_StudySpark.git'
            }
        }

        stage('Build') {
            steps {
                bat 'npm install'
                bat 'npm run build'
                bat 'docker build -t %IMAGE_NAME%:%IMAGE_TAG% .'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test -- --watchAll=false --passWithNoTests'
            }
        }

        stage('Code Quality') {
            steps {
                bat 'npx eslint src --ext .js,.jsx'
            }
        }

        stage('Security') {
            steps {
                bat 'npm audit || exit /b 0'
                bat 'docker save -o my-app.tar %IMAGE_NAME%:%IMAGE_TAG%'
                bat 'docker run --rm -v "%cd%:/tmp" aquasec/trivy image --input /tmp/my-app.tar || exit /b 0'
            }
        }

        stage('Deploy to Staging') {
            steps {
                bat 'docker rm -f my-app-staging || exit /b 0'
                bat 'docker run -d --name my-app-staging -p 3001:80 %IMAGE_NAME%:%IMAGE_TAG%'
            }
        }

        stage('Release to Production') {
            steps {
                input 'Approve production release?'
                bat 'docker rm -f my-app-prod || exit /b 0'
                bat 'docker run -d --name my-app-prod -p 3002:80 %IMAGE_NAME%:%IMAGE_TAG%'
            }
        }

        stage('Monitoring') {
            steps {
                bat 'curl http://localhost:3002'
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