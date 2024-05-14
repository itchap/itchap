/* 
** Author: Peter Smith  Date: 10 May 2024
** Calculates Kepler's third law of planetary motion used to calculate the gravitational constant (𝐺 G), 
** particularly in the context of binary star systems or planets orbiting a star, where 𝑚1 m1 and 𝑚2 m2
** are the masses of two bodies (e.g., a star and a planet, or two stars in a binary system), 𝑎 a is the 
** semi-major axis of the orbit, and 𝑃 P is the orbital period.
*/
public class Ex1q7 {
    public static void main(String args[])
    {
        double a=3.0, P=2.0, m1=4.0, m2=8.0;
        double G = 4 * Math.pow(Math.PI, 2) * (Math.pow(a, 3) / Math.pow(P, 2) * (m1 + m2));
        System.out.println("G = 4 x π² x (a³ / P² x (m1 + m2))");
        System.out.println("G = " + G);
    }
}
