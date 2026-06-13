def check(ranks, cars, mid):
    count = 0
    for i in range(len(ranks)):
        l = 1
        while((ranks[i]*l*l) <= mid):
            l += 1
        count += (l-1)

    if(count >= cars):
        return True
    return False
            

        
        



def repairCars(ranks, cars):
    s,e = 1,  len(ranks)*cars
    ans = -1

    while(s<=e):
        mid = s+(e-s)//2
        if(check(ranks, cars, mid)):
            ans = mid
            e = mid-1
        else:
            s = mid+1
    return int(ans)