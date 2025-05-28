/* 
** Author: Peter Smith  Date: 12 May 2024
** Prints my name using unicode values 
*/
public class Ex1q17 {
    public static void main(String args[])
    {
        int myNum = 10;
        System.out.println(myNum > 0 && myNum++ <= 10);  // 11 & true
        myNum--;                                         // 10
        System.out.println(myNum > 0 && ++myNum <= 10);  // 11 & false
        myNum--;                                         // 10
        System.out.println(myNum < 10 && myNum++ > 0);   // 10 & true. Stops evaluating as soon as logic is false
        System.out.println("The value of myNum is: " + myNum);
    }
}