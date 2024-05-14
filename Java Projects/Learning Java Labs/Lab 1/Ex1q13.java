/* 
** Author: Peter Smith  Date: 12 May 2024
** Calculates the area of a circle while observign how casting
** influences the conversion from float values.  
*/
public class Ex1q13 {
    public static void main(String args[])
    {
        float radius = 20f;
        int area = (int) Math.PI * (int) Math.pow(radius, 2);
        System.out.print("The area of a circle with a radius of " + (int)radius + " meters is: ");
        System.out.println(area + "m²");
    }
}