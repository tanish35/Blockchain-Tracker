Here's the updated markdown file with the steps to install Node.js, PM2, and how to start your server using PM2:

````markdown
# EC2 Instance Setup and Domain Configuration

## 1. Launch an EC2 Instance

- Launch an EC2 instance with Ubuntu.
- Make sure to select an appropriate security group allowing HTTP (80), HTTPS (443), and your backend ports (e.g., 3000, 8000).

## 2. Connect to EC2 Instance

- Use SSH to connect to your instance:
  ```bash
  ssh -i backend.pem ubuntu@13.51.201.30
  ```
````

## 3. Install Required Packages

- Update package lists:
  ```bash
  sudo apt update
  ```
- Install Nginx and Certbot:
  ```bash
  sudo apt install nginx
  sudo apt install certbot python3-certbot-nginx
  ```

## 4. Install Node.js and npm

- Install Node.js using the NodeSource repository:

  ```bash
  curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
  sudo apt install -y nodejs
  ```

- Verify the installation:
  ```bash
  node -v
  npm -v
  ```

## 5. Install PM2

- Install PM2 globally:

  ```bash
  sudo npm install -g pm2
  ```

- Verify the installation:
  ```bash
  pm2 -v
  ```

## 6. Start Your Server Using PM2

- Navigate to your project directory:

  ```bash
  cd /path/to/your/project
  ```

- Start your application with PM2:

  ```bash
  pm2 start your_server_file.js --name "your_app_name"
  ```

- To ensure PM2 restarts your application on server reboot:
  ```bash
  pm2 startup
  pm2 save
  ```

## 7. Configure Nginx

- Open the Nginx configuration file:

  ```bash
  sudo nano /etc/nginx/sites-available/default
  ```

- Add the following configuration for your two sites:

  ```nginx
  server {
      listen 3000;
      server_name api.devpixel.site;

      location / {
          proxy_pass http://localhost:3000;  # Assuming your backend is running on port 3000
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }
  }

  server {
      listen 8000;
      server_name api.tanish.me;

      location / {
          proxy_pass http://localhost:8000;  # Assuming your backend is running on port 8000
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
          proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto $scheme;
      }
  }
  ```

- Test the Nginx configuration:
  ```bash
  sudo nginx -t
  ```
- Restart Nginx to apply the changes:
  ```bash
  sudo systemctl restart nginx
  ```

## 8. Obtain SSL Certificates

- Ensure that your domain points to your EC2 instance.
- Run Certbot to obtain SSL certificates:

  ```bash
  sudo certbot --nginx -d api.devpixel.site -d api.tanish.me
  ```

- Follow the prompts to complete the setup.

## 9. Open Required Ports

- Check open ports:
  ```bash
  sudo ufw status
  ```
- Allow ports if necessary:
  ```bash
  sudo ufw allow 'Nginx Full'
  ```

## 10. Manage Your Backend Servers

- If you are using PM2 to manage your applications:
  - To stop a server running on port 3000:
    ```bash
    pm2 stop <app_name_or_id>
    ```
  - To close the port, ensure the process is stopped.

## 11. Uninstall `net-tools` (if needed)

- To remove `net-tools`:
  ```bash
  sudo apt remove net-tools
  ```

## Conclusion

Your EC2 instance is now set up with two backend servers accessible via custom domains and secured with SSL certificates. Node.js and PM2 are installed to manage your applications effectively. Make sure to monitor your servers and keep your system updated.

```

```
