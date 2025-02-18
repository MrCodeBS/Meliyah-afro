/*
  # Add RLS policies for users table
  
  1. Security Changes
    - Add policy to allow inserting new users
    - Add policy to allow users to update their own data
    - Add policy to allow admins to manage all users
*/

-- Allow inserting new users
CREATE POLICY "Anyone can create a new user account"
ON users FOR INSERT
WITH CHECK (true);

-- Allow users to update their own data
CREATE POLICY "Users can update own data"
ON users FOR UPDATE
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Allow admins to manage all users
CREATE POLICY "Admins can manage all users"
ON users FOR ALL
USING (auth.jwt()->>'role' = 'ADMIN')
WITH CHECK (auth.jwt()->>'role' = 'ADMIN');