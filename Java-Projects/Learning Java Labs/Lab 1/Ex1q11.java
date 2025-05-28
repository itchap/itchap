/* 
** Author: Peter Smith  Date: 12 May 2024
** Hours, Mins, Seconds to total seconds convertor
*/
public class Ex1q11 {
    public static void main(String args[])
    {
        int hours = 1;
        int mins = 48;
        int secs = 20;
        int totalSecs = (hours*60*60) + (mins * 60) + secs; 
        System.out.print("The total secs for " + hours + " hours, " + mins + " minutes and " + secs + " seconds is: ");
        System.out.println(totalSecs);
        
    }
}
