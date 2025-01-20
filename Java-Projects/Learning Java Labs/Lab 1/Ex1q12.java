/* 
** Author: Peter Smith  Date: 12 May 2024
** Observe the conversion behavious when strings, 
** chars and int are printed together.
*/
public class Ex1q12 {
    public static void main(String args[])
    {
        System.out.println("a"+1+2);
        System.out.println('a'+2+3);
        System.out.println("a"+'a');
        System.out.println(1+(2+"a"));
        System.out.println("Year " + 2000);
        System.out.println("Year " + 2000 + 2000);
        System.out.println("Year " + 2000 * 2000);
    }
}
