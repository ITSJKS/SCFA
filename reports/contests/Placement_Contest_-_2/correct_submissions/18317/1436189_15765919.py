import math
def min_speed(dist, hour):

    def condition(mid):

        hour_calc=0
        for i in range(len(dist)):
            hour_calc+=math.ceil(dist[i]/mid)

        return hour_calc<=hour
    


    l=1
    r=max(dist)

    while(l<r):
        mid=(l+r)//2
        if(condition(mid)):
            r=mid
        else:
            l=mid+1
    
    return l