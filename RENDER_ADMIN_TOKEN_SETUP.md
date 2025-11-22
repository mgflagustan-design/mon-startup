# Setting ADMIN_TOKEN on Render.com

## Step-by-Step Instructions

### 1. Log in to Render
- Go to [dashboard.render.com](https://dashboard.render.com)
- Log in with your account

### 2. Find Your Backend Service
- Look for a service named something like:
  - `mon-startup-api`
  - `mon-startup`
  - Or whatever you named your backend service
- Click on it to open the service dashboard

### 3. Navigate to Environment Variables
- In the left sidebar, click on **"Environment"**
- Or look for a tab/section labeled **"Environment Variables"**

### 4. Add the ADMIN_TOKEN
- Click **"Add Environment Variable"** or **"Add Variable"** button
- In the form that appears:
  - **Key:** `ADMIN_TOKEN`
  - **Value:** `7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9`
- **Important:** 
  - No quotes around the value
  - No spaces before or after
  - Copy the entire token exactly as shown
- Click **"Save Changes"** or **"Add"**

### 5. Wait for Redeploy
- Render will automatically detect the change and redeploy your service
- You'll see a deployment in progress (usually takes 1-2 minutes)
- Wait until it shows "Live" status

### 6. Test It
- Go to your Vercel frontend URL
- Visit `/admin/login`
- Enter the token: `7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9`
- Click "Sign In"
- Try marking an order as "Paid"

## Visual Guide

```
Render Dashboard
  └── Your Backend Service (e.g., "mon-startup-api")
      └── Environment Tab (left sidebar)
          └── Add Environment Variable
              ├── Key: ADMIN_TOKEN
              └── Value: 7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9
```

## Troubleshooting

**If you can't find the Environment tab:**
- Make sure you're looking at the **service** (not the project overview)
- The Environment tab is usually in the left sidebar or under "Settings"

**If the deployment fails:**
- Check the logs in Render to see what went wrong
- Make sure there are no extra spaces or quotes in the token value

**If you still get "Unauthorized":**
- Double-check the token matches exactly (no extra spaces)
- Wait a few minutes for the redeploy to complete
- Try logging out and back in on the frontend
- Check Render logs to see if the token is being read correctly

## Verify It's Set

After adding the variable, you can verify it's there:
1. Go back to the Environment tab
2. You should see `ADMIN_TOKEN` in the list of environment variables
3. The value should be hidden (shown as `••••••••`)

## Your Token (for reference)

```
7IAuEXOfSiGkSHZ822Tmo1oArHKEKq4Davsb8WIYAelOO0dU0HV08QOlV08WbRj9
```

Copy this exact value (no quotes, no spaces) into Render's environment variable value field.

