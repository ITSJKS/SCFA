import math

def can(mid,dist,hour):

    hrs = 0
    
    for i in dist:

        hrs += math.ceil(i/mid)


    return hrs <= hour


def min_speed(dist, hour):
    ans = -1

    s = 1
    e = max(dist) 

    while s <= e:
        mid = (s + e) // 2 

        if can(mid,dist,hour):
            ans = mid 
            e = mid - 1 

        else:
            s = mid + 1 

    return ans