/* 
** Author: Peter Smith  Date: 12 May 2024
** Secs to Hours, Mins, Seconds convertor
*/
public class Ex1q10 {
    public static void main(String args[])
    {
        int secs = 6500;
        double hours = secs/60/60;
        double mins = (secs - hours*60*60)/60;
        double remainSecs = secs - ((int)hours*60*60 + (int)mins*60);
        String secsToTime = (int)hours + ":" + (int)mins + ":" + (int)remainSecs;
        System.out.println(secs + " seconds in hours, mins and secs = " + secsToTime);
    }
}
