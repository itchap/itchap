/* 
** Author: Peter Smith  Date: 12 May 2024
** Demonstrate how casting can convert characters 
** to their unicode value. 
*/
public class Ex1q14 {
    public static void main(String args[])
    {
        char singleChar= 'A';
        System.out.println("The unicode for the character " + singleChar + " is: " + (int)singleChar);
    }
}