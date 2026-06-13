def min_speed(dist, hour):
    def seeling(x):
        y = x//1
        # print("and",y)
        if y < x:
            # print("seeling" ,y+1)
            return y + 1
        # print(y)
        return y 
    
    def time(t, dist):
        count = 0
        n = len(dist)
        for i in range(n):
            if i == n - 1:
                count += dist[i]/t
            else:
                count += seeling(dist[i]/t) 
        return count
    # print(time(3, dist))

    low = 1
    high = sum(dist)
    ans = 0
    while low <= high:
        mid = (low + high) // 2 
        # print(mid)
        if time(mid, dist) <= hour:
            ans = mid 
            high = mid - 1
        elif time(mid, dist) > hour:
           low = mid + 1
    return ans