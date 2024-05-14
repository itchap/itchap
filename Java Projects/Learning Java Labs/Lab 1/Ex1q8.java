/* 
** Author: Peter Smith  Date: 12 May 2024
** Calculates the area of a circle
*/
public class Ex1q8 {
    public static void main(String args[])
    {
        double radius = 20;
        double area = Math.PI * Math.pow(radius, 2);
        System.out.print("The area of a circle with a radius of " + (int) radius + " meters is: ");
        System.out.println(String.format("%.2f", area) + "m²");
    }
}
