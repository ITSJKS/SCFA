def min_speed(dist, hour):
    def check(speed):
        count = 0
        for i in range(len(dist) - 1):
            # print(dist[i])
            if dist[i] % speed == 0:
                count += dist[i] // speed
                # print(f'count: {count} dist: {dist[i]}')
            else:
                count += ( dist[i] // speed ) + 1
                # print(f'count: {count} dist: {dist[i]}')
        count += dist[-1] / speed
        # print(count)
        return count <= hour
    
    # print(check(5))
    hi = 10**9 + 7
    lo = 1
    ans = -1

    while lo <= hi:
        mid = (hi + lo) // 2
        if check(mid):
            # print(f'mid: {mid}')
            ans = mid
            hi = mid - 1
        else:
            # print(f'mid: {mid}')
            if check(mid):
                ans = mid
            lo = mid + 1
    
    return ans