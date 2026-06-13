def min_speed(dist, hour):
    
    def pobzible(dist, hour, mid):
        c = 0
        for i in range(len(dist) - 1):
            if(i % mid == 0):
                c += dist[i] // mid
            else:
                c += dist[i] // mid
                c += 1
        
        c += dist[-1] / mid
        
        if(c <= hour):
            return True
        else:
            return False

    
    max_speed = sum(dist)
    min_speed = 1

    while(min_speed <= max_speed):

        mid = (min_speed + max_speed) // 2

        if(pobzible(dist, hour, mid)):
            res = mid
            max_speed = mid - 1
        
        else:
            min_speed = mid + 1
    
    return res