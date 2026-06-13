def findDifference(N, nums):
    ev =[]
    od =[]
    for e in nums:
        if e%2==0:
            ev.append(e)
        else:
            od.append(e)
    x = sum(ev)-sum(od)
    return x