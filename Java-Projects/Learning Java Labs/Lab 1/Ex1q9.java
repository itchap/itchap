/* 
** Author: Peter Smith  Date: 12 May 2024
** Calculates the surface area and volume of a cylinder
*/
public class Ex1q9 {
    public static void main(String args[])
    {
        double radius = 20;
        double height = 20;
        double area = (2 * Math.PI * Math.pow(radius, 2)) + (2 * Math.PI * radius * height);
        double volume = Math.PI * Math.pow(radius, 2) * height;
        System.out.print("The surface area of a cylinder with a radius of " + (int) radius + " cms and a height of " + (int)height + " cms is: ");
        System.out.println(String.format("%.2f", area) + "cm²");
        System.out.print("The volume of a cylinder with a radius of " + (int) radius + " and a height of " + (int)height + " is: ");
        System.out.println(String.format("%.2f", volume) + "cm³");
    }
}
