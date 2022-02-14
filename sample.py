for case in range(int(input())):
    n = int(input())
    a = list(map(int, input().split()))
    d = {}
    print(f"Case #{case}:", end=" ")
    for i in range(n):
        if a[i] not in d:
            d[a[i]] = 0
        d[a[i]] += 1
        mx = 0
        for j in d.keys():
            if
