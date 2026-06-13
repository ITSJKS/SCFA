import math
def min_speed(dist, hour):
    def canreach(speed,hour,dist):
        ttr = 0
        for distance in dist:
            ttr+=(distance/speed)
            if(distance%speed!=0):
                ttr = math.ceil(ttr)
        # print(speed,ttr)
        return ttr<=hour
    start = 1
    end = max(dist)
    ans = -1
    while (start<=end):
        mid = (start+end)//2
        if (canreach(mid,hour,dist)):
            ans = mid
            end = mid -1
        else:
            start= mid + 1
    return ans