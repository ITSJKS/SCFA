def min_speed(dist, hour):
    ans = -1
    def check(s,dist,hour):
        h = 0
        for i in dist:
            if i%s == 0:
                h += i//s 
            else:    
                h += i//s +1
        if h <=hour:
            return True

    start = 1
    end = max(dist)
    while start <= end:
        mid = (start +end)//2
        if check(mid,dist,hour):
            ans = mid
            end = mid-1
        else:
            start = mid+1
    return ans