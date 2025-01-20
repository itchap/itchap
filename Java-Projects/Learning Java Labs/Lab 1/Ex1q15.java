/* 
** Author: Peter Smith  Date: 12 May 2024
** Demonstrate how casting can convert unicode values
** to their character representation. 
*/
public class Ex1q15 {
    public static void main(String args[])
    {
        int myNum = -100;
        char myChar = (char)myNum;
        System.out.println("The unicode for the character " + myChar + " is: " + myNum);
    }
}